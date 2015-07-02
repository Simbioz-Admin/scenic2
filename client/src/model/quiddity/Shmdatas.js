"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/quiddity/Shmdata'
], function ( _, Backbone, socket, ScenicCollection, Shmdata ) {

    /**
     * Shmdatas
     *
     * @constructor
     * @extends ScenicCollection
     */
    var Shmdatas = ScenicCollection.extend( {
        model:      Shmdata,
        comparator: 'id',
        quiddity:   null,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function() { return [ 'quiddity.tree.query', this.quiddity.id, '.shmdata' ] }
        },

        /**
         * Parse data from sync
         * We parse it here as the server doesn't know we asked for shmdata info (yeah, the path suggests it)
         * but for the moment parse it here instead of the server
         *
         * @param response
         * @returns {Array}
         */
        parse: function( response ) {
            var shmdatas = [];
            if ( response ) {
                this.quiddity.set( 'maxReaders', response.max_reader );
                if ( response.reader && typeof response.reader == 'object' ) {
                    _.each( response.reader, function ( shmdata, path ) {
                        shmdata.id = 'reader.' + path;
                        shmdata.path = path;
                        shmdata.type = 'reader';
                        shmdatas.push( shmdata );
                    } );
                }
                if ( response.writer && typeof response.writer == 'object' ) {
                    _.each( response.writer, function ( shmdata, path ) {
                        shmdata.id = 'writer.' + path;
                        shmdata.path = path;
                        shmdata.type = 'writer';
                        shmdatas.push( shmdata );
                    } );
                }
            }
            return shmdatas;
        },

        /**
         * Initialize
         */
        initialize: function() {
            ScenicCollection.prototype.initialize.apply(this,arguments);
        },

        /**
         * Bind to socket
         * This is done so that temporary models don't register with socket.io
         * This was causing them to keep being referenced event after being used
         */
        bindToSocket: function() {
            this.onSocket( 'shmdata.update', _.bind( this._onUpdateShmdata, this ) );
        },

        /**
         * Update Shmdata Handler
         *
         * There is no difference between updating and adding a shmdata so just merge-add,
         * that's also why this is done here and not in the shmdata class
         *
         * @param quiddityId
         * @param shmdata
         * @private
         */
        _onUpdateShmdata: function ( quiddityId, shmdata ) {
            if ( this.quiddity.id == quiddityId ) {
                // The id generation is done here but could as well be done on the server,
                // but since this id is only used in backbone's context I left it here.
                shmdata.id = shmdata.type + '.' + shmdata.path;
                // For now it is already parsed
                this.add( shmdata, { merge: true/*, parse: true*/ } );
            }
        }
    } );
    return Shmdatas;
} );
