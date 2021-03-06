"use strict";

define( [
    'underscore',
    'backbone',
    'i18n',
    'model/pages/base/Table',
    'model/pages/rtp/RTPDestinations',
    'model/pages/rtp/RTPDestination'
], function ( _, Backbone, i18n, Table, RTPDestinations, RTPDestination ) {

    /**
     * RTP Table
     *
     * @constructor
     * @extends Table
     */

    var RTP = Table.extend( {

        defaults: function () {
            return {
                id:          "rtp",
                name:        i18n.t( 'Transfer' ),
                type:        "transfer",
                description: i18n.t( "Manage connexions with host destination" )
            }
        },

        /**
         * Initialize
         */
        initialize: function (attributes, options) {
            Table.prototype.initialize.apply( this, arguments );
        },

        /**
         * Get destination collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {RTPDestinations}
         */
        getDestinationCollection: function() {
            if ( !this.destinations ) {
                this.destinations = new RTPDestinations( null, {scenic: this.scenic, quiddity: this.scenic.quiddities.get( this.scenic.config.rtp.quiddName )} );
            }
            return this.destinations;
        },

        /**
         * Filter destination for RTP, as we use a special collection, they all pass the test
         *
         * @inheritdoc
         */
        filterDestination: function( destination, useFilter ) {
            return true;
        },

        /**
         * Create an RTP Destination
         *
         * @param info
         */
        createRTPDestination: function ( info ) {
            var self = this;
            var rtpDestination = new RTPDestination({info: info}, {scenic: this.scenic});
            rtpDestination.save( null, {
                success: function( rtpDestination ) {
                    self.scenic.sessionChannel.vent.trigger( 'rtp:created' );
                }
            });
        },

        /**
         * Get connections
         *
         * @param {Shmdata} source
         * @param {RTPDestination} destination
         * @returns {*}
         */
        getConnection: function( source, destination ) {
            return _.findWhere( destination.get('data_streams'), { path: source.get('path') } );
        },

        /**
         * @inheritdoc
         * @param {Shmdata} source
         * @param {RTPDestination} destination
         * @return {boolean}
         */
        isConnected: function( source, destination ) {
            return this.getConnection(source, destination) != null;
        },

        /**
         * @inheritdoc
         * @param {Shmdata} source
         * @param {RTPDestination} destination
         * @param {Function} callback
         */
        canConnect: function( source, destination, callback ) {
            var isRaw = source.get('category') == 'video';
            var can = !isRaw;
            callback( can );
            return can;
        },

        /**
         * @inheritdoc
         * @param {Shmdata} shmdata
         * @param {RTPDestination} destination
         * @param {int} port
         * @param {Function} cb callback
         */
        connect: function ( shmdata, destination, port, cb ) {
            var self = this;
            this.scenic.socket.emit( 'rtp.destination.connect',  destination.id, shmdata.get('path'), port, function( error ) {
                if ( error ) {
                    console.error( error );
                    self.scenic.sessionChannel.vent.trigger( 'error', error );
                    return cb( error );
                }
                cb();
            } );
        },

        /**
         * @inheritdoc
         * @param {Shmdata} source
         * @param {RTPDestination} destination
         */
        disconnect: function( source, destination ) {
            var self = this;
            this.scenic.socket.emit( 'rtp.destination.disconnect', destination.id, source.get('path'), function( error ) {
                if ( error ) {
                    console.error( error );
                    self.scenic.sessionChannel.vent.trigger( 'error', error );
                }
            } );
        }
    } );

    return RTP;
} );