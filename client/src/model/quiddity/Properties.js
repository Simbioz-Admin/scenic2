"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/quiddity/Property'
], function ( _, Backbone, socket, ScenicCollection, Property ) {

    /**
     *  @constructor
     *  @augments ScenicCollection
     */
    var Properties = ScenicCollection.extend( {
        model:     Property,
        quiddity:  null,
        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function () {
                return ['getProperties', this.quiddity.id]
            }
        },

        initialize: function () {
            ScenicCollection.prototype.initialize.apply( this, arguments );

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
            if ( signal == "on-property-added" && this.quiddity.id == quiddityId ) {
                var property = this.add( {name: name[0]}, {merge: true} );
                property.fetch();
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
            if ( this.quiddity.id == quiddityId && this.get(property) == null ) {
                // Somehow the property doesn't exists, create it but stay safe with merge
                var property = this.add({name: property, value:value}, {merge:true});
                // We were not aware of this property, so fetch it
                property.fetch();
            }
        }
    } );
    return Properties;
} );
