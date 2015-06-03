"use strict";

define( [
    'jquery',
    'underscore',
    'backbone',
    'lib/socket',
    'model/pages/base/Table',
    'model/pages/rtp/RTPDestinations',
    'model/pages/rtp/RTPDestination'
], function ( $, _, Backbone, socket, Table, RTPDestinations, RTPDestination ) {

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
                name:        $.t( 'Transfer' ),
                type:        "transfer",
                description: $.t( "Manage connexions with host destination" ),
                source:      {
                    include: [
                        "sip",
                        "src",
                        "source",
                        "httpsdpdec",
                        "pclmergesink",
                        "pcltomeshsink",
                        "pcldetectsink",
                        "texturetomeshsink",
                        "meshmergesink"
                    ]
                }
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            Table.prototype.initialize.apply( this, arguments );
        },

        /**
         * Get destination collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {quiddities|*}
         */
        getDestinationCollection: function() {
            if ( !this.destinations ) {
                this.destinations = new RTPDestinations( null, {quiddity: app.quiddities.get( app.config.rtp.quiddName )} );
            }
            return this.destinations;
        },

        /**
         * Filter destination for RTP, as we use a special collection, they all pass the test
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
            var rtpDestination = new RTPDestination({info: info});
            rtpDestination.save( null, {
                success: function( rtpDestination ) {
                    self.scenicChannel.vent.trigger( 'rtp:created' );
                },
                error: function(error) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            });
        },

        getConnection: function( source, destination ) {
            return _.findWhere( destination.get('data_streams'), { path: source.get('path') } );
        },

        /**
         * Check if this destination is connected to a shmdata
         *
         * @param source
         * @return bool
         */
        isConnected: function( source, destination ) {
            return this.getConnection(source, destination) != null;
        },

        /**
         * @inheritdoc
         */
        canConnect: function( source, destination, callback ) {
            var isRaw = source.get('category') == 'video';
            var can = !isRaw;
            callback( can );
            return can;
        },

        /**
         * Connect a shmdata to a destination
         *
         * @param shmdata
         * @param destination
         * @param port
         * @param cb callback
         */
        connect: function ( shmdata, destination, port, cb ) {
            var self = this;
            socket.emit( 'connectRTPDestination', shmdata.id, destination.id, port, function( error ) {
                if ( error ) {
                    console.error( error );
                    self.scenicChannel.vent.trigger( 'error', error );
                    return cb( error );
                }
                cb();
            } );
        },

        /**
         * Disconnect a srouce form its destination
         * Override in concrete table classes
         *
         * @param source
         * @param destination
         */
        disconnect: function( source, destination ) {
            var self = this;
            socket.emit( 'disconnectRTPDestination', source.id, destination.id, function( error ) {
                if ( error ) {
                    console.error( error );
                    self.scenicChannel.vent.trigger( 'error', error );
                    return cb( error );
                }
            } );
        }
    } );

    return RTP;
} );