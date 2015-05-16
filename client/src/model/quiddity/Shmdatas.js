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
        quiddity:   null,
        comparator: function ( a, b ) {
            var aSip = a.getSipUser();
            var bSip = b.getSipUser();
            if ( aSip != bSip ) {
                return aSip != null ? aSip.localeCompare( bSip ) : bSip.localeCompare( aSip ) * -1;
            } else {
                var aPath = a.get( 'path' );
                var bPath = b.get( 'path' );
                return aPath != null ? aPath.localeCompare( bPath ) : ( bPath != null ? bPath.localeCompare( aPath ) * -1 : 0 );
            }
        },

        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function() { return [ 'getInfo', this.quiddity.id, '.shmdata' ] }
        },

        /**
         * Parse data from sync
         *
         * @param response
         * @returns {Array}
         */
        parse: function( response ) {
            console.log( 'HOW SHOUL I PARSE SHMDATAS:', response );
            return;
            var shmdatas = [];
            if ( response.reader ) {
                _.each( response.reader, function ( shmdata, path ) {
                    shmdata["path"]  = path;
                    shmdata["type"]  = 'reader';
                    shmdatas.push(shmdata);
                } );
            }
            if ( response.writer ) {
                _.each( response.writer, function ( shmdata, path ) {
                    shmdata["path"]  = path;
                    shmdata["type"]  = 'writer';
                    shmdatas.push(shmdata);
                } );
            }
            return shmdatas;
        },

        /**
         * Initialize
         */
        initialize: function() {
            ScenicCollection.prototype.initialize.apply(this,arguments);

            // Handlers
            this.onSocket( 'addShmdata', _.bind( this._onAddShmdata, this ) );
        },

        /**
         * Add Shmdata Handler
         *
         * @param quiddName
         * @param shmdata
         * @private
         */
        _onAddShmdata: function ( quiddName, shmdata ) {
            if ( this.quiddity && this.quiddity.id == quiddName ) {
                this.add( shmdata, { merge: true } );
            }
        }
    } );
    return Shmdatas;
} );
