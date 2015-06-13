"use strict";

define( [
    'underscore',
    'backbone',
    'i18n',
    'model/pages/base/Table'
], function ( _, Backbone, i18n, Table ) {

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
                name:        i18n.t( "SIP" ),
                type:        "transfer",
                description: i18n.t( "Manage transfer of shmdatas to SIP contacts" )
            }
        },

        /**
         * Initialize
         */
        initialize: function ( attributes, options) {
            Table.prototype.initialize.apply( this, arguments );
        },

        /**
         * Get destination collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {Contacts}
         */
        getDestinationCollection: function() {
            return this.scenic.sip.contacts;
        },

        /**
         * Add a potential destination
         * Flag the contact to be temporarily show in destinations
         * Normally only contacts with connections appear as a destination
         *
         * @param {Contact} contact
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
            this.scenic.socket.emit( 'attachShmdataToContact', source.get('path'), destination.id, function( error ) {
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
            this.scenic.socket.emit( 'detachShmdataFromContact', source.get('path'), destination.id, function( error ) {
                if (error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        }
    } );

    return SIP;
} );