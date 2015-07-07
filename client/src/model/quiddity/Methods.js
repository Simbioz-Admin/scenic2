"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicCollection',
    'model/quiddity/Method'
], function ( _, Backbone, ScenicCollection, Method ) {

    /**
     * Method Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var Methods = ScenicCollection.extend( {
        model:     Method,
        comparator: 'order',
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
        initialize: function (models, options) {
            ScenicCollection.prototype.initialize.apply( this, arguments );
            this.quiddity = options.quiddity;
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
         * @param {string} method The method attributes
         */
        _onMethodAdded: function ( quiddityId, method ) {
            if ( this.quiddity.id == quiddityId ) {
                this.add( method, {merge: true, parse: true} );
            }
        }
    } );

    return Methods;
} );
