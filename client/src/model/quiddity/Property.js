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
        /*mutators: {
            value: {
                /!**
                 * Value setter, syncs with the backend when the value changes
                 *
                 * @param key
                 * @param value
                 * @param options
                 * @param set
                 *!/
                set: function( key, value, options, set ) {
                    // Sync value with the server only if it changes (prevents double setting when gettign confirmation back)
                    console.log( key, this.attributes[key], this.get(key), value );
                    if ( this.get(key) != value ) {
                        socket.emit( "set_property_value", this.collection.quiddity.id, this.id, value, function ( error ) {
                            if ( error ) {
                                return this.scenicChannel.vent( 'error', error );
                            }
                            set( key, value, options );
                        } );
                    }
                },
                get: function() {
                    return this.get('value');
                }
            }
        },*/

        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);

            // Handlers
            this.onSocket( "signals_properties_info", _.bind( this._onSignalsPropertiesInfo, this ) );
            this.onSocket( "signals_properties_value", _.bind( this._onSignalsPropertiesValue, this ) );
        },

        /**
         * Internally set the value of the property
         * We set the internal flag so that we can ignore the following update event in the ui and thus avoid
         * re-rendering the view aimlessly.
         *
         * @param value
         */
        setValue: function( value ) {
            var self = this;
            if ( this.get('default value') != value ) {
                socket.emit( "set_property_value", this.collection.quiddity.id, this.id, value, function ( error ) {
                    if ( error ) {
                        return self.scenicChannel.vent( 'error', error );
                    }
                    self.set('default value', value, { internal: true } );
                } );
            }
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
            if ( this.collection.quiddity.id == quiddityId && this.id == property && this.get('default value') != value ) {
                this.set('default value', value);
            }
        }
    } );

    return Property;
} );