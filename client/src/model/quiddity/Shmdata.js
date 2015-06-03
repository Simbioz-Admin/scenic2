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
            'byte-rate':0,
            category:   null,
            type:       null,
            caps:       null,
            maxReaders: null
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

            // Handlers
            this.onSocket( 'removeShmdata', _.bind( this._onRemoved, this ) );
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





        //  ██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗
        //  ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝
        //  ██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝
        //  ██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝
        //  ███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║
        //  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝
        //

        /**
         * If this is a shmdata for a sipquidd, this will provide the sip user parsed from the shmdata name
         */
        /*getSipUser: function () {
         var sipUser = null;
         if ( this.get( 'quidd' ) == config.sip.quiddName ) {
         var parts     = this.get( 'path' ).replace( 'vumeter_', '' ).split( '_' );
         var name      = parts[parts.length - 2];
         var sipPrefix = config.sip.quiddName + '-';
         if ( name.indexOf( sipPrefix ) == 0 ) {
         sipUser = name.substr( sipPrefix.length );
         }
         }
         return sipUser;
         }*/
    } );
    return Shmdata;
} );