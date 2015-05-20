"use strict";

define( [
    'jquery',
    'underscore',
    'backbone',
    'lib/socket',
    'model/pages/base/Table'
], function ( $, _, Backbone, socket,  Table ) {

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

        getDestinationCollection: function() {
            var rtp = app.quiddities.get(app.config.rtp.quiddName);
            if ( !rtp ) {
                return null;
            }
            var destinations = rtp.get('properties' ).get('destinations-json');
           // if ( !destinations || !)
            console.log( rtp, app.config.rtp.quiddName );
        },

        /**
         * Create an RTP Destination
         *
         * @param info
         */
        createRTPDestination: function ( info ) {
            var self = this;
            socket.emit('createRTPDestination', info, function( error ) {
                if( error ) {
                    return self.scenicChannel.vent.trigger('error', error);
                }
                self.scenicChannel.vent.trigger('rtp:created');
            })

        }
    } );

    return RTP;
} );