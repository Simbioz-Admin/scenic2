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
            this.onSocket( "onSignal", _.bind( this._onSignal, this ) );
        },

        /**
         * Signals Property Info Handler
         * Listens to method addition concerning our parent quiddity and add new methods if it matches
         *
         * @param {string} quiddityId The name of the quiddity
         * @param {string} signal The type of event on property or method
         * @param {string} name The name of the property or method
         */
        _onSignal: function ( quiddityId, signal, name ) {
            if ( signal == "on-method-added" && this.quiddity.id == quiddityId ) {
                var method = this.add( {id: name}, {merge: true} );
                //The method is empty at this point, fetch its content
                method.fetch();
            }
        }
    } );

    return Methods;
} );
