"use strict";

define( [
    'underscore',
    'backbone',
    'cocktail',
    'crypto-js',
    'app',
    'model/mixins/PropertyWatcher',
    'model/sip/Contacts',
    'model/sip/Contact'
], function ( _, Backbone, Cocktail, CryptoJS, app, PropertyWatcher, Contacts, Contact ) {

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
                connected:  false,
                connecting: false,
                server:     null,
                user:       null,
                port:       null
            }
        },

        /**
         * Initialize
         */
        initialize: function (attributes, options) {
            this.scenic = options.scenic;

            // Main communication channel
            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            var sip = JSON.parse( localStorage.getItem( 'sip' ) );
            this.set( 'server', sip && sip.server ? sip.server : this.scenic.config.sip.server );
            this.set( 'port', sip && sip.port ? sip.port : this.scenic.config.sip.port );
            this.set( 'user', sip && sip.user ? sip.user : null );
            this.set( 'uri', sip && sip.uri ? sip.uri : null );

            this.quiddityId   = this.scenic.config.sip.quiddName;
            this.propertyName = 'sip-registration';

            this.self = new Contact( null, {self: true, sip: this, scenic: this.scenic });
            this.contacts = new Contacts( null, {sip: this, scenic: this.scenic});

            // Fetch contacts
            this.listenTo( this.contacts, 'update', this._checkForSelf );
            this.contacts.fetch();
        },

        propertyChanged: function ( value ) {
            this.set( 'connected', !!value );
        },

        /**
         * Login
         *
         * @param server
         * @param port
         * @param user
         * @param password
         * @param callback
         */
        login: function ( server, port, user, password, callback ) {
            var self = this;

            this.set( 'server', server );
            this.set( 'port', _.isEmpty(port) ? this.get('port') : port );
            this.set( 'user', user );
            this.set( 'uri', user + '@' + server );

            this.set( 'connecting', true );

            this.scenicChannel.vent.trigger( 'sip:login' );

            var credentials = {
                server:   server,
                port:     port,
                user:     user,
                password: CryptoJS.AES.encrypt( password, this.secretString ).toString()
            };

            localStorage.setItem( 'sip', JSON.stringify( {
                server: server,
                port:   port,
                user:   user,
                uri:    user + '@' + server
            } ) );

            this.scenic.socket.emit( 'sip.login', credentials, function ( error ) {
                self.set( 'connecting', false );
                if ( error ) {
                    self.scenicChannel.vent.trigger( 'sip:loggedout', error );
                    self.scenicChannel.vent.trigger( 'error', error );
                    if ( callback ) {
                        callback( error );
                    }
                    return;
                }
                self.scenicChannel.vent.trigger( 'sip:loggedin' );
                if ( callback ) {
                    callback();
                }
            } );
        },

        /**
         * Logout
         */
        logout: function () {
            var self = this;
            this.scenic.socket.emit( 'sip.logout', function ( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
                self.scenicChannel.vent.trigger( 'sip:loggedout', error );
            } );
        },

        /**
         * Add Contact
         *
         * @param uri
         */
        addContact: function ( uri ) {
            var self    = this;
            var contact = new Contact();
            contact.save( {uri: uri}, {
                success: function () {
                    //no-op
                },
                error:   function ( error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        },

        _checkForSelf: function() {
            var self = this.contacts.findWhere( { self: true } );
            if ( self ) {
                this.self.set( self.attributes );
            }

        }
    } );

    Cocktail.mixin( SIPConnection, PropertyWatcher );

    return SIPConnection;
} );