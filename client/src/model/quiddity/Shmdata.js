"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicModel'
], function ( _, Backbone, ScenicModel ) {

    /**
     * Shmdata
     *
     * @constructor
     * @extends ScenicModel
     */
    var Shmdata = ScenicModel.extend( {

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
                    var name = this.get( 'path' ).split('_')[3];
                    return name ? name : this.get('path');
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
                this.onSocket( 'shmdata.update.rate', _.bind( this._onRateUpdated, this ) );
                this.onSocket( 'shmdata.remove', _.bind( this._onRemoved, this ) );
            }
        },

        /**
         * Update byte rate
         * This is only a temporary solution until a better tree management is put in place
         * @private
         */
        _onRateUpdated: function( quiddityId, shmdataId, value ) {
            if ( quiddityId == this.collection.quiddity.id && shmdataId == this.id ) {
                this.set('byte_rate', value);
            }
        },

        /**
         * Shmdata Remove Handler
         * We delete ourselves if we are from the right quiddity and of the right type, discriminating by path if one
         * was provided, otherwise we delete all of the same type.
         *
         * @param quiddityId
         * @param shmdata
         * @private
         */
        _onRemoved: function ( quiddityId, shmdata ) {
            if ( this.collection.quiddity.id == quiddityId && shmdata.type == this.get( 'type' ) && (!shmdata.path || ( shmdata.path && shmdata.path == this.get('path') ) ) ) {
                this.trigger( 'destroy', this, this.collection );
            }
        }

    } );
    return Shmdata;
} );