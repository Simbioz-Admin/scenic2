"use strict";

define( [
    'jquery',
    'underscore',
    'backbone',
    'lib/socket',
    'model/pages/base/Table'
], function ( $, _, Backbone, socket, Table ) {

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
            return this.sip.get('contacts');
        },

        /**
         * Add a potential destination
         * Flag the contact to be temporarily show in destinations
         * Normally only contacts with connections appear as a destination
         *
         * @param contact
         */
        addDestination: function( contact ) {
            contact.set('showInDestinations', true);
            // A little hack here to trigger marionette's rendering of the collectionview
            contact.collection.trigger('reset');
        },

        /**
         * Filter destination for SIP
         * Shows both contacts with connections and contacts flagged to be shown temporarily
         *
         * @inheritdoc
         */
        filterDestination: function( destination, useFilter ) {
            return destination.has('connection') || destination.get('showInDestinations');
        },

        /**
         * Retrieve the connection between a source and destination
         */
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
            var isRaw = source.get('category') == 'video';
            var can = !isRaw;
            callback( can );
            return can;
        },

        /**
         * @inheritdoc
         */
        connect: function( source, destination ) {
            var self = this;
            socket.emit( 'attachShmdataToContact', source.id, destination.id, function( error ) {
                if (error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        },

        /**
         * @inheritdoc
         */
        disconnect: function( source, destination ) {
            var self = this;
            socket.emit( 'detachShmdataFromContact', source.id, destination.id, function( error ) {
                if (error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        }
    } );

    return SIP;
} );