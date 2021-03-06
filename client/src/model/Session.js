"use strict";

define( [
    'underscore',
    'backbone',
    'async',
    'socketio',
    // Model
    'model/SaveFiles',
    'model/ClassDescriptions',
    'model/Quiddities',
    'model/SIPConnection'
], function ( _, Backbone, async, io,
              // Models
              SaveFiles, ClassDescriptions, Quiddities, SIPConnection) {

    /**
     * Session
     *
     * @constructor
     * @extends module:Backbone.Model
     */

    var Session = Backbone.Model.extend( {

        defaults: function() {
            return {
                id:          null,
                name:        null,
                host:        null,
                lang:        localStorage.getItem( 'lang' ) ? localStorage.getItem( 'lang' ) : 'en',
                default:     false,
                connecting:  false,
                connected:   false,
                active:      false,
                shutdown:    false
            }
        },

        /**
         * Initialize
         */
        initialize: function ( attributes, options ) {

            this.set('connecting', true);

            // Session models
            this.config            = null;
            this.saveFiles         = null;
            this.classes           = null;
            this.quiddities        = null;
            this.sip               = null;

            // Establish missing values
            if (!this.get('id')) {
                this.set( 'id', this.get( 'host' ) ? this.get( 'host' ) : 'default' );
            }
            if (!this.get('name')) {
                this.set( 'name', this.get( 'id' ) );
            }

            // Session Config
            this.sessionConfig = this.readSessionConfig();

            // Global Scenic Channel
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            // Session Channel
            this.sessionChannel = Backbone.Wreqr.radio.channel( this.id );

            // Session Socket.io
            this.socket = io.connect( this.get('host') );

            // Announce ourselves and recover config information from the server
            var self = this;
            this.socket.emit( 'config', this.get('lang'), this.sessionConfig.socketId ? this.sessionConfig.socketId : null, function ( config ) {
                self.sessionConfig.socketId = self.socket.id;
                self.flushScenicConfig();
                self.start( config );
            } );

            // When the server is closed or crashes shutdown the app
            this.socket.on( 'shutdown', _.bind( this._onShutdown, this ) );
            this.socket.on( 'disconnect', _.bind( this._onShutdown, this ) );
        },

        start: function( config ) {
            if ( this.started ) {
                return;
            }

            // Configuration
            this.config = config;

            var self = this;

            async.series( [

                // Get class descriptions
                function ( callback ) {
                    self.saveFiles = new SaveFiles(null, {scenic: self});
                    self.saveFiles.fetch( {success: _.partial( callback, null ), error: callback} );
                },

                // Get class descriptions
                function ( callback ) {
                    self.classes = new ClassDescriptions(null, {scenic:self});
                    self.classes.fetch( {success: _.partial( callback, null ), error: callback} );
                },

                // Get Quiddities
                function ( callback ) {
                    self.quiddities = new Quiddities( null, {scenic: self} );
                    self.quiddities.fetch( {success: _.partial( callback, null ), error: callback} );
                },

                // SIP
                function ( callback ) {
                    self.sip = new SIPConnection(null, {scenic: self});
                    //self.sip.autoconnect( {success: _.partial( callback, null ), error: callback} );
                    callback();
                }

            ], function ( error ) {
                if ( error ) {
                    //TODO: Initialization errors
                    alert( error.toString() );
                    console.error( error );
                    if ( callback ) {
                        callback( error );
                    }
                    return;
                }

                self.set('connecting', false);
                self.set('connected', true);

                if ( self.get('default') ) {
                    self.activate();
                }
            } );

            this.started = true;
        },

        readScenicConfig: function() {
            // Local config
            var scenicConfig = JSON.parse( localStorage.getItem( 'scenic' ) ) || {};
            if ( !scenicConfig.sessions ) {
                scenicConfig.sessions = {};
            }
            return scenicConfig;
        },

        readSessionConfig: function() {
            var scenicConfig = this.readScenicConfig();
            if ( !scenicConfig.sessions[this.id] ) {
                scenicConfig.sessions[this.id] = {};
            }
            return scenicConfig.sessions[this.id];
        },

        flushScenicConfig: function() {
            var scenicConfig = this.readScenicConfig();
            scenicConfig.sessions[this.id] = this.sessionConfig;
            localStorage.setItem( 'scenic', JSON.stringify( scenicConfig ) );
        },

        /**
         * Activate a session
         */
        activate: function () {
            this.collection.setCurrentSession( this );
        },

        _onShutdown: function () {
            if ( !this.get('shutdown') ) {
                this.set( 'connected', false );
                this.set( 'shutdown', true );
                this.sessionChannel.vent.trigger( 'shutdown' );
                this.socket.close();
                this.socket.removeAllListeners();
                this.sessionChannel.reset();
                this.saveFiles.reset();
                this.classes.reset();
                this.quiddities.reset();
                this.sip.destroy();
                //TODO: Destroy even more!
            }
        }
    } );

    return Session;
} );