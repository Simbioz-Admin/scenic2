"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicCollection',
    'model/SaveFile'
], function ( _, Backbone, ScenicCollection, SaveFile ) {

    /**
     * SaveFile Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var SaveFiles = ScenicCollection.extend( {
        model:      SaveFile,
        comparator: 'name',
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'file.list'
        },

        parse: function( result ) {
            return _.map( result, function( item ) { return { name: item }; } );
        },

        /**
         * Initialize
         */
        initialize: function( models, options ) {
            ScenicCollection.prototype.initialize.apply(this,arguments);

            // Handlers
            this.onSocket( 'file.saved', _.bind( this._onSaved, this ) );
        },

        /**
         * Saved Handler
         * Listens to file creations and add/merge new files to the collection
         *
         * @private
         * @param file
         */
        _onSaved: function ( file ) {
            var file = this.add( {name: file}, {merge: true} );
            this.scenicChannel.vent.trigger( 'file:added', file );
        }
    } );
    return SaveFiles;
} );
