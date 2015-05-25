"use strict";

define( [
    'jquery',
    'underscore',
    'backbone',
    'lib/socket',
    'model/pages/base/Table',
    'model/pages/rtp/RTPDestinations'
], function ( $, _, Backbone, socket, Table, RTPDestinations ) {

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
                    include: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"]
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
                this.destinations = new RTPDestinations( null, {property: app.quiddities.get( app.config.rtp.quiddName ).get( 'properties' ).get( 'destinations-json' )} );
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
            socket.emit( 'createRTPDestination', info, function ( error ) {
                if ( error ) {
                    return self.scenicChannel.vent.trigger( 'error', error );
                }
                self.scenicChannel.vent.trigger( 'rtp:created' );
            } )
        },


        /**
         * Check if this destination is connected to a shmdata
         *
         * @param source
         * @return bool
         */
        isConnected: function( source ) {
            //todo: check if not in the destinaton data_streams
            return false;
        },

        /**
         * Check if a source can connect to a destination
         * Override in concrete table classes
         *
         * @param source
         * @param destination
         * @param callback
         */
        canConnect: function( source, destination, callback ) {
            callback( true );
        },

        /**
         * Connect a shmdata to a destination
         *
         * @param shmdata
         * @param destination
         */
        connect: function ( shmdata, destination ) {
            var self = this;
            socket.emit( 'connectRTPDestination', shmdata.id, destination.id, null /* TODO: port */, function( error ) {
                if ( error ) {
                    console.error( error );
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        }
    } );

    return RTP;
} );