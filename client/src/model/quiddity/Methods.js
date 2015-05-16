"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/quiddity/Method'
], function ( _, Backbone, socket, ScenicCollection, Method ) {

    /**
     *  @constructor
     *  @augments ScenicCollection
     */
    var Methods = ScenicCollection.extend( {
        model:     Method,
        quiddity:  null,
        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function () {
                return ['getMethods', this.quiddity.id]
            }
        },

        initialize: function () {
            ScenicCollection.prototype.initialize.apply( this, arguments );

            socket.on( "signals_properties_info", _.bind( this._onSignalsPropertiesInfo, this ) );
        },

        /**
         * Signals Property Info Handler
         *
         * @param {string} signal The type of event on property or method
         * @param {string} quiddityId The name of the quiddity
         * @param {string} name The name of the property or method
         */
        _onSignalsPropertiesInfo: function ( signal, quiddityId, name ) {
            if ( signal == "on-method-added" && this.quiddity.id == quiddityId ) {
                var method = this.add( {name: name[0]}, {merge: true} );
                method.fetch();
            }
        }
    } );
    return Methods;
} );
