"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, ScenicModel ) {

    /**
     * Shmdata
     *
     * @constructor
     * @extends ScenicModel
     */
    var Shmdata = ScenicModel.extend( {

        idAttribute: "path",

        defaults: {
            path:       null,
            byte_rate:  0,
            category:   null,
            type:       null,
            caps:       null
        },

        mutators: {
            name: {
                transient: true,
                get: function() {
                    return this.get( 'path' ).split('_')[3];
                }
            }
        },

        /**
         *  Initialize
         */

        initialize: function () {
            ScenicModel.prototype.initialize.apply( this, arguments );

            // Only bind to socket if we aren't new
            // We don't want temporary models staying referenced by socket.io
            if ( !this.isNew() ) {
                this.onSocket( 'removeShmdata', _.bind( this._onRemoved, this ) );
            }
        },

        /**
         * Shmdata Remove Handler
         *
         * @param quiddityId
         * @param shmdata
         * @private
         */
        _onRemoved: function ( quiddityId, shmdata ) {
            if ( this.collection.quiddity.id == quiddityId && shmdata.path == this.id && shmdata.type == this.get( 'type' ) ) {
                this.trigger( 'destroy', this, this.collection );
            }
        }

    } );
    return Shmdata;
} );