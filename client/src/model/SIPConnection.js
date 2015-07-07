"use strict";

define( [
    'underscore',
    'backbone',
    'cocktail',
    'crypto-js',
    'model/sip/Contacts',
    'model/sip/Contact'
], function ( _, Backbone, Cocktail, CryptoJS, Contacts, Contact ) {

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

        statuses: [
            'available',
            'online',
            'busy',
            'away',
            'offline'
        ],

        /**
         * Initialize
         */
        initialize: function (attributes, options) {
            this.scenic = options.scenic;

            var sip = JSON.parse( localStorage.getItem( 'sip' ) );
            this.set( 'server', sip && sip.server ? sip.server : this.scenic.config.sip.server );
            this.set( 'port', sip && sip.port ? sip.port : this.scenic.config.sip.port );
            this.set( 'user', sip && sip.user ? sip.user : null );
            this.set( 'uri', sip && sip.uri ? sip.uri : null );

            this.contacts = new Contacts( null, {sip: this, scenic: this.scenic});

            // Here we have to set up a watcher on quiddities updates because SIP is not always available
            // and we need to track properties on whichever instance will come up from the network
            this.listenTo( this.scenic.quiddities, 'add', this._onQuiddityAdded );
            this.listenTo( this.scenic.quiddities, 'remove', this._onQuiddityRemoved );
            if ( this.scenic.quiddities.get(this.scenic.config.sip.quiddName)) {
                this._registerSipQuiddity(this.scenic.quiddities.get(this.scenic.config.sip.quiddName));
            }

            this.on( 'destroy', function() {
                console.log('destroy');
                this.contacts.reset();
            });
        },

        _registerSipQuiddity: function( sipQuiddity ) {
            this.quiddity = sipQuiddity;
            this.contacts.setSipQuiddity( this.quiddity );
            this.listenTo( this.quiddity.properties.get( 'sip-registration' ), 'change:value', this._onSipRegistrationChange );
            this._onSipRegistrationChange();
        },

        _onQuiddityAdded: function(model, collection, options) {
            if ( model.id == this.scenic.config.sip.quiddName ) {
                this._registerSipQuiddity(model);
            }
        },

        _onQuiddityRemoved: function(model, collection, options) {
            if ( model.id == this.scenic.config.sip.quiddName ) {
                if ( this.quiddity ) {
                    this.stopListening( this.quiddity.properties.get( 'sip-registration' ), 'change:value', this._onSipRegistrationChange );
                    this.quiddity = null;
                    this._onSipRegistrationChange();
                }
            }
        },

        /**
         * Handler for when the watched property 'sip-registration' changes.
         */
        _onSipRegistrationChange: function () {
            var connected = this.quiddity.properties.get('sip-registration' ).get('value');
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

            this.scenic.sessionChannel.vent.trigger( 'sip:login' );

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
                    self.scenic.sessionChannel.vent.trigger( 'sip:loggedout', error );
                    self.scenic.sessionChannel.vent.trigger( 'error', error );
                    if ( callback ) {
                        callback( error );
                    }
                    return;
                }
                self.scenic.sessionChannel.vent.trigger( 'sip:loggedin' );
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
                    self.scenic.sessionChannel.vent.trigger( 'error', error );
                }
                self.scenic.sessionChannel.vent.trigger( 'sip:loggedout', error );
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
                    self.scenic.sessionChannel.vent.trigger( 'error', error );
                }
            } );
        }
    } );

    return SIPConnection;
} );