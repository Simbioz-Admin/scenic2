"use strict";

define( [
    'underscore',
    'backbone',
    'i18n',
    'lib/socket',
    'model/pages/base/Table'
], function ( _, Backbone, i18n, socket, Table ) {

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
        initialize: function ( options ) {
            Table.prototype.initialize.apply( this, arguments );
            this.sip = options.sip;
        },

        /**
         * Get destination collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {Contacts}
         */
        getDestinationCollection: function () {
            return this.sip.get( 'contacts' );
        },

        /**
         * Get destinations
         * Currently the same as the collection
         *
         * @returns {Contacts}
         */
        getDestinations: function() {
            return this.getDestinationCollection().filter( function ( contact ) {
                return !contact.get('self');
            });
        },

        /**
         * Add a potential destination
         * Flag the contact to be temporarily show in destinations
         * Normally only contacts with connections appear as a destination
         *
         * @param {Contact} contact
         */
        addDestination: function ( contact ) {
            contact.set( 'showInDestinations', true );
            // A little hack here to trigger marionette's rendering of the CollectionView
            contact.collection.trigger( 'reset' );
        },

        /**
         * Filter destination for SIP
         * Shows both contacts with connections and contacts flagged to be shown temporarily
         *
         * @inheritdoc
         */
        filterDestination: function ( destination, useFilter ) {
            return ( destination.has( 'connections' ) && destination.get( 'connections' ).length > 0 ) || destination.get( 'showInDestinations' );
        },

        /**
         * Retrieve the connection between a source and destination
         */
        getConnection: function ( source, destination ) {
            return destination.get( 'connections' ) && _.isArray( destination.get( 'connections' ) ) && destination.get( 'connections' ).indexOf( source.get( 'path' ) ) != -1 ? source.get( 'path' ) : null;
        },

        /**
         * @inheritdoc
         */
        isConnected: function ( source, destination ) {
            return this.getConnection( source, destination ) != null;
        },

        /**
         * @inheritdoc
         */
        canConnect: function ( source, destination, callback ) {
            var isRaw = source.get( 'category' ) == 'video';
            var can   = !isRaw;
            callback( can );
            return can;
        },

        /**
         * @inheritdoc
         */
        connect: function ( source, destination ) {
            var self = this;
            socket.emit( 'sip.contact.attach', destination.id, source.get( 'path' ), function ( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        },

        /**
         * @inheritdoc
         */
        disconnect: function ( source, destination ) {
            var self = this;
            socket.emit( 'sip.contact.detach', destination.id, source.get( 'path' ), function ( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        }
    } );

    return SIP;
} );