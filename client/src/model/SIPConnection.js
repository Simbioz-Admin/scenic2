"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'crypto-js',
    'model/sip/Contacts',
    'model/sip/Contact'
], function ( _, Backbone, socket, CryptoJS, Contacts, Contact ) {

    /**
     * SIP Connection
     *
     * @constructor
     * @extends module:Backbone.Model
     */

    var SIPConnection = Backbone.Model.extend( {

        secretString: 'Les patates sont douces!',
        sipQuiddity:  null,

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

            this.set( 'server', localStorage.getItem( 'sip.server' ) ? localStorage.getItem( 'sip.server' ) : app.config.sip.server );
            this.set( 'port', localStorage.getItem( 'sip.port' ) ? localStorage.getItem( 'sip.port' ) : app.config.sip.port );
            this.set( 'user', localStorage.getItem( 'sip.user' ) );

            // Setup listeners for quiddity additions/removals
            this.listenTo( app.quiddities, 'add', this._onQuiddityAdded );
            this.listenTo( app.quiddities, 'remove', this._onQuiddityRemoved );

            // Setup the sip quiddity (if it exists)
            this.sipQuiddity = app.quiddities.get( app.config.sip.quiddName );
            this._registerSIPQuiddity();

            // Fetch contacts
            this.get('contacts').fetch();
        },

        /**
         * Quiddity Added Handler
         * Will check for the addition of the SIP quiddity in order to watch it for SIP status
         *
         * @param quiddity
         * @private
         */
        _onQuiddityAdded: function ( quiddity, quiddities, options ) {
            if ( quiddity.id == app.config.sip.quiddName ) {
                this.sipQuiddity = quiddity;
                this._registerSIPQuiddity();
            }
        },

        /**
         * Quiddity Removed Handler
         * Stops watching the SIP quiddity when it is removed
         *
         * @param quiddity
         * @private
         */
        _onQuiddityRemoved: function ( quiddity, quiddities, options ) {
            if ( quiddity.id == app.config.sip.quiddName ) {
                this._unregisterSIPQuiddity();
            }
        },

        /**
         * Registers the sip quiddity event handlers
         * Will watch for property changes in order to determine the status
         * Updates the status while we're here
         *
         * @private
         */
        _registerSIPQuiddity: function () {
            if ( this.sipQuiddity ) {
                this.listenTo( this.sipQuiddity.get( 'properties' ), 'add', this._sipQuiddityPropertyAdded );
                this.listenTo( this.sipQuiddity.get( 'properties' ), 'remove', this._sipQuiddityPropertyRemoved );

                var registrationProperty = this.sipQuiddity.get( 'properties' ).get( 'sip-registration' );
                if ( registrationProperty ) {
                    this.listenTo( registrationProperty, 'change:value', this.checkRegistration );
                }

                /*var statusProperty = this.sipQuiddity.get( 'properties' ).get( 'status' );
                if ( statusProperty ) {
                    this.listenTo( statusProperty, 'change:value', this.checkStatus );
                }*/
            }

            this.checkRegistration();
            //this.checkStatus();
        },

        /**
         * Unregisters the sip quiddity event handlers
         * Will stop watching for property changes to determine status
         * Updates the status while we're here
         *
         * @private
         */
        _unregisterSIPQuiddity: function () {
            if ( this.sipQuiddity ) {
                this.stopListening( this.sipQuiddity.get( 'properties' ), 'add', this._sipQuiddityPropertyAdded );
                this.stopListening( this.sipQuiddity.get( 'properties' ), 'remove', this._sipQuiddityPropertyRemoved );

                var registrationProperty = this.sipQuiddity.get( 'properties' ).get( 'sip-registration' );
                if ( registrationProperty ) {
                    this.stopListening( registrationProperty, 'change:value', this.checkRegistration );
                }

                /*var statusProperty = this.sipQuiddity.get( 'properties' ).get( 'status' );
                if ( statusProperty ) {
                    this.stopListening( statusProperty, 'change:value', this.checkStatus );
                }*/

                this.sipQuiddity = null;
            }

            this.checkRegistration();
            //this.checkStatus();
        },

        /**
         * Property Added Handler
         * Checks if the sip quiddity now has a sip-registration property that we can watch to determine status
         * Updates the status while we're here
         *
         * @param property
         * @param properties
         * @param options
         * @private
         */
        _sipQuiddityPropertyAdded: function ( property, properties, options ) {
            if ( property.id == 'sip-registration' ) {
                this.listenTo( this.sipQuiddity.get( 'properties' ).get( 'sip-registration' ), 'change:value', this.checkRegistration );
                this.checkRegistration();
                //this.listenTo( this.sipQuiddity.get( 'properties' ).get( 'status' ), 'change:value', this.checkStatus );
                //this.checkStatus();
            }
        },

        /**
         * Property Removed Handler
         * Stops watching the sip-registration property since it doesn't exist anymore
         * Updates the status while we're here
         *
         * @param property
         * @param properties
         * @param options
         * @private
         */
        _sipQuiddityPropertyRemoved: function ( property, properties, options ) {
            if ( property.id == 'sip-registration' ) {
                this.stopListening( this.sipQuiddity.get( 'properties' ).get( 'sip-registration' ), 'change:value', this.checkRegistration );
                this.checkRegistration();
                //this.stopListening( this.sipQuiddity.get( 'properties' ).get( 'status' ), 'change:value', this.checkStatus );
                //this.checkStatus();
            }
        },


        /**
         * Check Registration
         * Verifies that we have a sip quiddity which possesses a sip-registration property to determine status
         */
        checkRegistration: function () {
            var registered = false;
            if ( this.sipQuiddity ) {
                var registeredProperty = this.sipQuiddity.get( 'properties' ).get( 'sip-registration' );
                if ( registeredProperty ) {
                    registered = registeredProperty.get( 'value' );
                }
            }
            this.set( 'connected', registered );
        },

        /**
         * Check SIP status
         * Verifies that we have a sip quiddity which possesses a status property to determine status
         */
        /*checkStatus: function () {
            var status = 'OFFLINE';
            if ( this.sipQuiddity ) {
                var statusProperty = this.sipQuiddity.get( 'properties' ).get( 'status' );
                if ( statusProperty ) {
                    status = statusProperty.get( 'value' );
                }
            }
            this.set( 'status', status );
        },*/

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

            localStorage.setItem( 'sip.server', server );
            localStorage.setItem( 'sip.port', port );
            localStorage.setItem( 'sip.user', user );

            socket.emit( 'sipLogin', credentials, function ( error, sipConfig ) {
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
    return SIPConnection;
} );