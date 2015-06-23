"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, ScenicModel ) {

    /**
     * SIP Contact
     *
     * @constructor
     * @extends ScenicModel
     */

    var Contact = ScenicModel.extend( {

        defaults: {
            status:             'offline',
            status_text:        '',
            subscription_state: '',
            uri:                null,
            send_status:        null,
            recv_status:        null,
            name:               null,
            self:               false,
            // Dynamic
            showInDestinations: false
        },

        methodMap: {
            'create': function () {
                return ['sip.contact.add', this.get( 'uri' )];
            },
            'update': function () {
                return ['sip.contact.update', this.get( 'uri' ), {
                    name:        this.get( 'name' ),
                    status:      this.get( 'status' ),
                    status_text: this.get( 'status_text' )
                }];
            },
            'patch':  null,
            'delete': function () {
                return ['sip.contact.remove', this.get( 'uri' )];
            },
            'read':   null
        },

        /**
         * Initialize
         */
        initialize: function ( attributes, options ) {
            ScenicModel.prototype.initialize.apply( this, arguments );

            if ( options && options.self ) {
                this.self = options.self;
            }
            if ( options && options.sip ) {
                this.sip = options.sip;
            }
            // Handlers
            //this.onSocket( 'removeUser', _.bind( this._onRemoved, this ) );
        },

        /**
         * Delete Handler
         *
         * @param {String} uri
         * @private
         */
        /*_onRemoved: function ( uri ) {
         if ( this.id == uri ) {
         this.trigger( 'destroy', this, this.collection );
         }
         },*/

        /**
         * Call Contact
         */
        call: function ( cb ) {
            var self = this;
            socket.emit( 'sip.contact.call', this.id, function ( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                    if ( cb ) {
                        return cb( error );
                    }
                }
                if ( cb ) {
                    cb();
                }
            } );
        },

        /**
         * Hang Up Contact
         */
        hangUp: function ( cb ) {
            var self = this;
            socket.emit( 'sip.contact.hangup', this.id, function ( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                    if ( cb ) {
                        return cb( error );
                    }
                }
                if ( cb ) {
                    cb();
                }
            } );
        },

        /**
         * Disconnect All
         * Hangs up and removes all shmdata connections
         */
        disconnectAll: function () {
            // Start by removing the flag pinning the contact as a destination
            // It won't remove it from the table if it has connections but will prevent
            // it from sticking there as we explicitly want to remove it
            this.set( 'showInDestinations', false );
            // A little hack here to trigger marionette's rendering of the CollectionView
            this.collection.trigger( 'reset' );

            // Then notify the server we want to disconnect this contact from everything
            // Later signals will then remove it from the table as it is not sticky anymore
            socket.emit( 'sip.contact.disconnect', this.id, function ( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        },

        /**
         * Disconnect the contact
         */

        /**
         *  Edit Contact
         */
        edit: function () {
            var self = this;
            this.scenicChannel.commands.execute( 'contact:edit', this, function ( info ) {
                //TODO: Use the contact's internal update method
                socket.emit( 'sip.contact.update', self.id, info, function ( error ) {
                    if ( error ) {
                        self.scenicChannel.vent.trigger( 'error', error );
                        return;
                    }
                } )
            } );
        }
    } );

    return Contact;
} );