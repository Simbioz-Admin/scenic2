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
    'model/SIPConnection',
    // Legacy
    'app'
], function ( _, Backbone, async, io,
              // Models
              SaveFiles, ClassDescriptions, Quiddities, SIPConnection,
              Scenic ) {

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
                connected:   false
            }
        },

        /**
         * Initialize
         */
        initialize: function ( attributes, options ) {

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

            // Session Channel
            this.sessionChannel = Backbone.Wreqr.radio.channel( this.id );

            // Session Socket.io
            this.socket = io.connect( this.get('host') );

            // Announce ourselves and recover config information from the server
            var self = this;
            this.socket.emit( 'config', lang, this.sessionConfig.socketId ? this.sessionConfig.socketId : null, function ( config ) {
                self.sessionConfig.socketId = self.socket.id;
                self.flushScenicConfig();
                self.start( config );
            } );

            // When the server is closed or crashes shutdown the app
            this.socket.on( 'shutdown', _.bind( this._onShutdown, this ) );
            this.socket.on( 'disconnect', _.bind( this._onShutdown, this ) );

            this.scenic = new Scenic( this.get('host'), this.get('lang') );
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

                self.set('connected', true);
                // Scenic Main View
                //self.scenicView = new ScenicView( self );
                //self.scenicView.render();
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
        }
    } );

    return Session;
} );