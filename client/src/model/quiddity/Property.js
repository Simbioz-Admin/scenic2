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
        idAttribute: 'name',

        defaults: {
            'type': null,
            'writable': null,
            'name': null,
            'long name': null,
            'short description': null,
            'default value': null,
            'position category': null,
            'position weight': 0,
            // Custom
            value: null
        },

        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function () {
                return ['getPropertyDescription', this.collection.quiddity.id, this.get('name')]
            }
        },

        /**
         * Parse 'default value' in to value, unless it already exists.
         * Created because having spaces in 'default value' breaks the backbone model events and also default
         * value does not mean value, it was misleading and could not be changed server-side as the server is
         * unaware of the specifics like this.
         *
         * @param response
         */
        parse: function( response ) {
            if ( !response.value ) {
                response.value = response['default value'];
            }
            return response;
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);

            // Automatically sync value change with the server if the change is not internal
            this.on('change:value', function(model, value, options){
                if ( options.internal ) {
                    // Keep last synced value as a backup in case setting a value fails
                    this.lastSyncedValue = value;
                    return;
                }
                var self = this;
                socket.emit( "setPropertyValue", this.collection.quiddity.id, this.id, value, function ( error ) {
                    if ( error ) {
                        // There was an error setting the value, go back to the last synced value or the default
                        // TODO: Retrieve good value from server in that case
                        self.set('value', self.lastSyncedValue !== undefined ? self.lastSyncedValue : self.get('default value'), { internal: true } );
                        return self.scenicChannel.vent( 'error', error );
                    }
                } );
            });

            // Handlers
            this.onSocket( "signals_properties_info", _.bind( this._onSignalsPropertiesInfo, this ) );
            this.onSocket( "signals_properties_value", _.bind( this._onSignalsPropertiesValue, this ) );
        },

        /**
         * Signals Property Info Handler
         * Listens to property removal concerning our parent quiddity and destroy this property if it matches
         *
         * @param {string} signal The type of event on property or method
         * @param {string} quiddityId The name of the quiddity
         * @param {string} name The name of the property or method
         */
        _onSignalsPropertiesInfo: function ( signal, quiddityId, name ) {
            if ( signal == "on-property-removed" && this.collection.quiddity.id == quiddityId && this.id == name[0] ) {
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
        _onSignalsPropertiesValue: function ( quiddityId, property, value ) {
            if ( this.collection.quiddity.id == quiddityId && this.id == property && this.get('value') != value ) {
                // Here we use the internal flag so that we don't try to re-sync that change with the server
                this.set('value', value, { internal: true });
            }
        }
    } );

    return Property;
} );