define( [
    'exports',
    // Lib
    'underscore',
    'backbone',
    'mutators',
    'marionette',
    'async',
    'jquery',
    'i18n',
    // Internal Lib
    'socketio',
    // Model
    'model/SaveFiles',
    'model/ClassDescriptions',
    'model/Quiddities',
    'model/SIPConnection',
    // View
    'view/ScenicView',
    'view/ShutdownView'
], function ( exports, _, Backbone, Mutators, Marionette, async, $, i18n,
              // socketio
              io,
              // Models
              SaveFiles, ClassDescriptions, Quiddities, SIPConnection,
              // Views
              ScenicView, ShutdownView ) {

    /**
     * Scenic Application
     *
     * @param {string} [host]
     * @param {string} [lang]
     * @constructor
     */
    function Scenic( host, lang ) {
        //this.localConfig       = null;
        this.config            = null;
        this.saveFiles         = null;
        this.classes           = null;
        this.quiddities        = null;
        this.sip               = null;

        /*if (!lang) {
            lang = localStorage.getItem( 'lang' ) ? localStorage.getItem( 'lang' ) : 'en';
        }*/

        // Global message bus
        //this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

        // Configuration
        //this.hostName    = host ? host : 'default';
        //this.localConfig = this.readLocalConfig();

        // Socket.io
        //this.socket = io.connect( host );

        // Announce ourselves and recover config information from the server
        var self = this;
        this.socket.emit( 'config', lang, this.localConfig.hosts[this.hostName].socketId ? this.localConfig.hosts[this.hostName].socketId : null, function ( config ) {
            self.localConfig.hosts[self.hostName].socketId = self.socket.id;
            self.flushLocalConfig();
            self.initialize( config );
        } );

        // When the server is closed or crashes shutdown the app
        this.socket.on( 'shutdown', _.bind( this._onShutdown, this ) );
        this.socket.on( 'disconnect', _.bind( this._onShutdown, this ) );
    }

    /**
     * Helper method to read local config
     *
     * @returns {object} Local configuration
     */
    /*Scenic.prototype.readLocalConfig = function () {
        // Local config
        var localConfig = JSON.parse( localStorage.getItem( 'scenic' ) ) || {};
        if ( !localConfig.hosts ) {
            localConfig.hosts = {};
        }
        if ( !localConfig.hosts[this.hostName] ) {
            localConfig.hosts[this.hostName] = {};
        }
        return localConfig;
    };
*/
    /**
     * Helper method to flush local config
     */
    /*Scenic.prototype.flushLocalConfig = function () {
        localStorage.setItem( 'scenic', JSON.stringify( this.localConfig ) );
    };*/

    /**
     * Initialize
     *
     * @param config
     */
    /*Scenic.prototype.initialize = function ( config ) {

        if ( this.initialized ) {
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

            // Scenic Main View
            //self.scenicView = new ScenicView( self );
            //self.scenicView.render();
        } );

        this.initialized = true;
    };*/

    /*Scenic.prototype._onShutdown = function () {
        this.scenicChannel.vent.trigger( 'shutdown' );
        this.socket.close();
        this.scenicView.destroy();
        this.shutdownView = new ShutdownView( this );
        this.shutdownView.render();
    };*/

    /**
     * We use exports as this module will be subject to circular dependency as it is required by many other modules
     * @see http://requirejs.org/docs/api.html#circular
     */
    /*exports.config            = config;
     exports.initialize        = initialize;
     exports.shutdown          = shutdown;
     exports.saveFiles         = saveFiles;
     exports.classDescriptions = classDescriptions;
     exports.quiddities        = quiddities;
     exports.sip               = sip;
     exports.tables            = tables*/


    return Scenic;
} );