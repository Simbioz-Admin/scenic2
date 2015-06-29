"use strict";

define( [
    'underscore',
    'backbone',
    'cocktail',
    'lib/socket',
    'crypto-js',
    'app',
    'model/sip/Contacts',
    'model/sip/Contact'
], function ( _, Backbone, Cocktail, socket, CryptoJS, app, Contacts, Contact ) {

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
                port:       null,
                self:       null,
                contacts:   new Contacts( null, { sip: this } ),
                quiddity:   null
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            // Main communication channel
            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            var sip = JSON.parse( localStorage.getItem( 'sip' ) );
            this.set( 'server', sip && sip.server ? sip.server : app.config.sip.server );
            this.set( 'port', sip && sip.port ? sip.port : app.config.sip.port );
            this.set( 'user', sip && sip.user ? sip.user : null );
            this.set( 'uri', sip && sip.uri ? sip.uri : null );

            // Here we have to set up a watcher on quiddities updates because SIP is not always available
            // and we need to track properties on whichever instance will come up from the network
            this.listenTo( app.quiddities, 'add', this._onQuiddityAdded );
            this.listenTo( app.quiddities, 'remove', this._onQuiddityRemoved );
            if ( app.quiddities.get(app.config.sip.quiddName)) {
                this._registerSipQuiddity(app.quiddities.get(app.config.sip.quiddName));
            }
        },

        _registerSipQuiddity: function( sipQuiddity ) {
            this.set('quiddity', sipQuiddity);
            this.listenTo( this.get('quiddity').get( 'properties' ).get( 'sip-registration' ), 'change:value', this._onSipRegistrationChange );
            this._onSipRegistrationChange();
        },

        _onQuiddityAdded: function(model, collection, options) {
            if ( model.id == app.config.sip.quiddName ) {
                this._registerSipQuiddity(model);
            }
        },

        _onQuiddityRemoved: function(model, collection, options) {
            if ( model.id == app.config.sip.quiddName ) {
                if ( this.quiddity ) {
                    this.stopListening( this.get('quiddity').get( 'properties' ).get( 'sip-registration' ), 'change:value', this._onSipRegistrationChange );
                    this.set('quiddity', null);
                    this._onSipRegistrationChange();
                }
            }
        },

        /**
         * Handler for when the watched property 'sip-registration' changes.
         */
        _onSipRegistrationChange: function () {
            var connected = this.get('quiddity').get('properties' ).get('sip-registration' ).get('value');
            this.set( 'connected', connected );
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
            this.set( 'port', _.isEmpty( port ) ? this.get( 'port' ) : port );
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

            socket.emit( 'sip.login', credentials, function ( error ) {
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
            socket.emit( 'sip.logout', function ( error ) {
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
            contact.save( { uri: uri }, {
                success: function () {
                    //no-op
                },
                error:   function ( error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
        }
    } );

    return SIPConnection;
} );