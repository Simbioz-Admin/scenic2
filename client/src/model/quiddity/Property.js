"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, ScenicModel ) {

    /**
     * Property
     *
     * @constructor
     * @extends ScenicModel
     */

    var Property = ScenicModel.extend( {
        defaults: {
            'type':        null,
            'writable':    null,
            'name':        null,
            'description': null,
            'default':     null,
            'value':       null,
            'order':       0
        },

        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function () {
                return ['getPropertyDescription', this.collection.quiddity.id, this.id]
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply( this, arguments );

            // When syncing, save value as a backup
            this.on( 'sync',  function ( model, response, options ) {
                this.lastSyncedValue = this.get( 'value' );
            } );

            // Only bind to socket if we aren't new
            // We don't want temporary models staying referenced by socket.io
            if ( !this.isNew() ) {
                this.onSocket( "onSignal", _.bind( this._onSignal, this ) );
                this.onSocket( "propertyChanged", _.bind( this._onPropertyChanged, this ) );
            }
        },

        /**
         * Signals Property Info Handler
         * Listens to property removal concerning our parent quiddity and destroy this property if it matches
         *
         * @param {string} quiddityId The name of the quiddity
         * @param {string} signal The type of event on property or method
         * @param {string} name The name of the property or method
         */
        _onSignal: function ( quiddityId, signal, name ) {
            if ( !this.isNew() && signal == "on-property-removed" && this.collection.quiddity.id == quiddityId && this.id == name ) {
                this.trigger( 'destroy', this, this.collection );
            }
        },

        /**
         * Signals Property Value Handler
         * Listens to property values changes concerning our parent quiddity and update this property if it matches
         *
         * @param {string} quiddityId The name of the quiddity
         * @param {string} property The name of the property or method
         * @param {string} value The value of the property
         */
        _onPropertyChanged: function ( quiddityId, property, value ) {
            if ( !this.isNew() && this.collection.quiddity.id == quiddityId && this.id == property && this.get( 'value' ) != value ) {
                this.set( 'value', value );
                // Keep last synced value as a backup in case setting a value fails
                this.lastSyncedValue = value;
            }
        },

        /**
         * Update the value with the server
         *
         * @param value
         */
        updateValue: function ( value ) {
            var self = this;
            this.set('value', value, { internal: true });
            socket.emit( "setPropertyValue", this.collection.quiddity.id, this.id, value, function ( error ) {
                if ( error ) {
                    // There was an error setting the value, go back to the last synced value or the default
                    self.set( 'value', self.lastSyncedValue !== undefined ? self.lastSyncedValue : self.get( 'default' ) );
                    return self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        }
    } );

    return Property;
} );