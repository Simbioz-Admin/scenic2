"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/Quiddity'
], function ( _, Backbone, socket, ScenicCollection, Quiddity ) {

    /**
     * Quiddities Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var Quiddities = ScenicCollection.extend( {
        model:     Quiddity,
        comparator: function( quiddity ) {
            return quiddity.get('classDescription' ).get('category') + '.' + quiddity.get('class') + '.' + quiddity.id;
        },

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

            // Passed quiddity class descriptions
            this.classes = options.classes;

            // Handlers
            this.onSocket( "create", _.bind( this._onCreate, this ) );
        },

        /**
         * Create Handler
         * Listens to quiddity creations and add/merge new quiddities to the collection
         *
         * @private
         * @param quiddityData
         * @param socketId
         */
        _onCreate: function ( quiddityData, socketId ) {
            var quiddity = this.add( quiddityData, {merge: true, parse: true} );
            this.scenicChannel.vent.trigger( 'quiddity:added', quiddity );
            // If we created it, start editing it
            if ( socket.id == socketId ) {
                //TODO: Send quiddity:created with local flag instead
                quiddity.edit();
            }
        }
    } );

    return Quiddities;
} );