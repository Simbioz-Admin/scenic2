"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, ScenicModel ) {

    /**
     *  @constructor
     *  @augments ScenicModel
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

        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);
            this.scenicChannel = Backbone.Wreqr.radio.channel('scenic');

            socket.on( "signals_properties_info", _.bind( this._onSignalsPropertiesInfo, this ) );
            socket.on( "signals_properties_value", _.bind( this._onSignalsPropertiesValue, this ) );
        },

        /**
         * Signals Property Info Handler
         *
         * @param {string} signal The type of event on property or method
         * @param {string} quiddityId The name of the quiddity
         * @param {string} name The name of the property or method
         */
        _onSignalsPropertiesInfo: function ( signal, quiddityId, name ) {
            if ( signal == "on-property-removed" && this.quiddity.id == quiddityId &&  this.get('name') == name[0] ) {
                this.trigger( 'destroy', this, this.collection );
            }
        },

        /**
         *  Signals Property Value Handler
         *
         *  @param {string} quiddityId The name of the quiddity
         *  @param {string} property The name of the property or method
         *  @param {string} value The value of the property
         */
        _onSignalsPropertiesValue: function ( quiddityId, property, value ) {
            if ( this.collection.quiddity.id == quiddityId && this.id == property ) {
                this.set('value', value);
                console.log( quiddityId, property, value );
                var properties = this.get( "properties" );
                //TODO: Make this a collection/model too
                if ( properties.length == 0 ) {
                    this.get( 'properties' ).push( {name: property, value: value} );
                } else {
                    this.get( "properties" )[property]["default value"] = value;
                }
                this.trigger( "update:value", property );
            }
        }
    } );
    return Property;
} );