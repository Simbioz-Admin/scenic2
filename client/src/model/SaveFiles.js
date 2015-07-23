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
            result.date = new Date( result.date );
            return result;
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
         * @param attributes
         */
        _onSaved: function ( attributes ) {
            var file = this.add( attributes, {merge: true} );
            this.scenic.sessionChannel.vent.trigger( 'file:added', file );
        }
    } );
    return SaveFiles;
} );
