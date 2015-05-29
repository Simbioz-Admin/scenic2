"use strict";

define( [
    'underscore',
    'backbone',
    'cocktail',
    'lib/socket',
    'crypto-js',
    'model/mixins/PropertyWatcher',
    'model/sip/Contacts',
    'model/sip/Contact'
], function ( _, Backbone, Cocktail, socket, CryptoJS, PropertyWatcher, Contacts, Contact ) {

    /**
     * SIP Connection
     *
     * @constructor
     * @extends module:Backbone.Model
     */

    var SIPConnection = Backbone.Model.extend( {

        secretString: 'Les patates sont douces!',

        defaults: function () {
            return {
                connected: false,
                status:    'OFFLINE',
                note:      null,
                me:        new Contact(),
                contacts:  new Contacts()
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            // Main communication channel
            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            var sip = localStorage.getItem('sip');
            this.set( 'server', sip && sip.server ? sip.server : app.config.sip.server );
            this.set( 'port', sip && sip.port ? sip.port : app.config.sip.port );
            this.set( 'user', sip && sip.user ? sip.user : null );

            this.quiddityId = app.config.sip.quiddName;
            this.propertyName = 'sip-registration';

            // Fetch contacts
            this.get('contacts').fetch();
        },

        propertyChanged: function( value ) {
            this.set('connected', value);
        },

        /**
         * Login
         *
         * @param server
         * @param port
         * @param user
         * @param password
         */
        login: function ( server, port, user, password ) {
            var self = this;

            this.scenicChannel.vent.trigger( 'sip:login' );

            var credentials = {
                server:   server,
                port:     port,
                user:     user,
                password: CryptoJS.AES.encrypt( password, this.secretString ).toString()
            };

            localStorage.setItem( 'sip', { server: server, port: port, user: user } );

            socket.emit( 'sipLogin', credentials, function ( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger( 'sip:loggedout', error );
                    return self.scenicChannel.vent.trigger( 'error', error );
                }
                self.scenicChannel.vent.trigger( 'sip:loggedin' );
            } );
        },

        /**
         * Add Contact
         *
         * @param uri
         */
        addContact: function ( uri ) {
            var self = this;
            var contact = new Contact( );
            contact.save({uri:uri}, {
                success: function() {
                    //no-op
                },
                error: function(error) {
                    self.scenicChannel.vent.trigger('error', error);
                }
            });
        }
    } );

    Cocktail.mixin( SIPConnection, PropertyWatcher );

    return SIPConnection;
} );