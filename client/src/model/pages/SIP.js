"use strict";

define( [
    'jquery',
    'underscore',
    'backbone',
    'lib/socket',
    'model/pages/base/Table',
    'model/pages/sip/SIPDestinations'
], function ( $, _, Backbone, socket, Table, SIPDestinations ) {

    /**
     * SIP Table
     *
     * @constructor
     * @extends Table
     */

    var SIP = Table.extend( {

        defaults: function () {
            return {
                id:          "sip",
                name:        $.t( "SIP" ),
                type:        "transfer",
                description: $.t( "Manage transfer of shmdatas to SIP contacts" ),
                source:      {
                    include: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"]
                }
            }
        },

        /**
         * Initialize
         */
        initialize: function ( options) {
            Table.prototype.initialize.apply( this, arguments );
            this.sip = options.sip;
        },

        /**
         * Get destination collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {quiddities|*}
         */
        getDestinationCollection: function() {
            if ( !this.destinations ) {
                this.destinations = new SIPDestinations( null, {quiddity: app.quiddities.get( app.config.sip.quiddName )} );
            }
            return this.destinations;
        },

        /**
         * Add a potential destination
         *
         * @param contact
         */
        addDestination: function( contact ) {
            this.destinations.add( contact, { merge: true } );
        },

        /**
         * Filter destination for RTP, as we use a special collection, they all pass the test
         * @inheritdoc
         */
        filterDestination: function( destination, useFilter ) {
            return true;
        },

        getConnection: function( source, destination ) {
            return destination.get('connection') ? destination.get('connection')[source.get('path')] : null;
        },

        /**
         * @inheritdoc
         */
        isConnected: function( source, destination ) {
            return this.getConnection(source, destination) != null;
        },

        /**
         * @inheritdoc
         */
        canConnect: function( source, destination, callback ) {
            callback( true );
        },

        /**
         * @inheritdoc
         */
        connect: function( source, destination ) {
            var self = this;
            //TODO: Hang up and call again
            socket.emit( 'attachShmdataToContact', source.id, destination.id, function( error ) {
                if (error ) {
                    console.error( error );
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        },

        /**
         * @inheritdoc
         */
        disconnect: function( source, destination ) {
            var self = this;
            //TODO: Hang up and call again
            socket.emit( 'detachShmdataFromContact', source.id, destination.id, function( error ) {
                if (error ) {
                    console.error( error );
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        }
    } );

    return SIP;
} );