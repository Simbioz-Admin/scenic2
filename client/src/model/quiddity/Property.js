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
            'position weight': 0
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
        mutators: {
            value: {
                /**
                 * Value setter, syncs with the backend when the value changes
                 *
                 * @param key
                 * @param value
                 * @param options
                 * @param set
                 */
                set: function( key, value, options, set ) {
                    socket.emit( "set_property_value", this.collection.quiddity.id, this.id, value, function ( error ) {
                        if ( error ) {
                            return this.scenicChannel.vent('error', error );
                        }
                        set( key, value, options );
                    } );
                }
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);
            this.scenicChannel = Backbone.Wreqr.radio.channel('scenic');

            // Handlers
            socket.on( "signals_properties_info", _.bind( this._onSignalsPropertiesInfo, this ) );
            socket.on( "signals_properties_value", _.bind( this._onSignalsPropertiesValue, this ) );
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
            if ( signal == "on-property-removed" && this.collection.quiddity.id == quiddityId && this.get('name') == name[0] ) {
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
            console.log(this);
            if ( this.collection.quiddity.id == quiddityId && this.id == property ) {
                this.set('value', value);
            }
        }
    } );

    return Property;
} );