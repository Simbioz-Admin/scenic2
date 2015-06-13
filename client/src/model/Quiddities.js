"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicCollection',
    'model/Quiddity'
], function ( _, Backbone, ScenicCollection, Quiddity ) {

    /**
     * Quiddities Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var Quiddities = ScenicCollection.extend( {
        model:     Quiddity,
        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'quiddity.list'
        },

        /**
         * Initialize
         */
        initialize: function ( models, options ) {
            ScenicCollection.prototype.initialize.apply( this, arguments );

            this.scenic = options.scenic;
            this.classes = this.scenic.classes;

            // Handlers
            this.onSocket( "create", _.bind( this._onCreate, this ) );
        },

        /**
         * Create Handler
         * Listens to quididity creations and add/merge new quiddities to the collection
         *
         * @private
         * @param quiddityData
         * @param socketId
         */
        _onCreate: function ( quiddityData, socketId ) {
            var quiddity = this.add( quiddityData, {merge: true} );
            this.scenicChannel.vent.trigger( 'quiddity:added', quiddity );
            // If we created it, start editing it
            if ( this.scenic.socket.id == socketId ) {
                //TODO: Send quiddity:created with local flag instead
                quiddity.edit();
            }
        }
    } );

    return Quiddities;
} );