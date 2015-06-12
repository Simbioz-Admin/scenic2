"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/SaveFile'
], function ( _, Backbone, socket, ScenicCollection, SaveFile ) {

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
        initialize: function() {
            ScenicCollection.prototype.initialize.apply(this,arguments);
        }
    } );
    return SaveFiles;
} );
