"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/quiddity/Method'
], function ( _, Backbone, socket, ScenicCollection, Method ) {

    /**
     * Method Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var Methods = ScenicCollection.extend( {
        model:     Method,
        comparator: 'position weight',
        quiddity:  null,
        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function () {
                return ['quiddity.method.list', this.quiddity.id]
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicCollection.prototype.initialize.apply( this, arguments );
        },

        /**
         * Bind to socket
         * This is done so that temporary models don't register with socket.io
         * This was causing them to keep being referenced event after being used
         */
        bindToSocket: function() {
            this.onSocket( "quiddity.method.added", _.bind( this._onMethodAdded, this ) );
        },

        /**
         * Method Added Handler
         *
         * @param {string} quiddityId The name of the quiddity
         * @param {string} name The name of the property or method
         */
        _onMethodAdded: function ( quiddityId, method ) {
            if ( this.quiddity.id == quiddityId ) {
                this.add( method, {merge: true} );
            }
        }
    } );

    return Methods;
} );
