"use strict";

var fs              = require( 'fs' );
var _               = require( 'underscore' );
var i18n            = require( 'i18next' );
var async           = require( 'async' );
var switcher        = require( 'switcher' );
var SipManager      = require( './SipManager' );
var QuiddityManager = require( './QuiddityManager' );
var ReceiverManager = require( './ReceiverManager' );
var log             = require( '../lib/logger' );
var logback         = require( './logback' );
var checkPort       = require( '../utils/check-port' );

/**
 * Constructor
 *
 * @param config
 * @param io
 * @constructor
 */
function SwitcherController( config, io ) {
    this.config   = config;
    this.io       = io;
    this.switcher = switcher;

    this.quiddityManager = new QuiddityManager( config, switcher, io );
    this.sipManager      = new SipManager( config, switcher, io );
    this.receiverManager = new ReceiverManager( config, switcher, io );
}

/**
 * Initialize
 * Sets up the default Scenic environment
 *
 * @param callback
 */
SwitcherController.prototype.initialize = function ( callback ) {

    log.debug( "Initializing Switcher..." );

    var self = this;

    // Switcher Callbacks
    switcher.register_log_callback( this._onSwitcherLog.bind( this ) );

    /**
     * DEFAULTS
     */

    log.debug( 'Setting up system...' );

    // SOAP Control
    log.debug( 'Creating SOAP Control Server...' );
    switcher.create( 'SOAPcontrolServer', this.config.soap.quiddName );

    // Create the default quiddities necessary to use switcher
    log.debug( 'Creating RTP Session...' );
    switcher.create( 'rtpsession', this.config.rtpsession );

    // Create quiddity systemusage to get information about the CPU usage
    log.debug( 'Creating System Usage...' );
    switcher.create( 'systemusage', this.config.systemUsage.quiddName );
    switcher.set_property_value( this.config.systemUsage.quiddName, 'period', String( this.config.systemUsage.period ) );
    switcher.subscribe_to_signal( this.config.systemUsage.quiddName, 'on-tree-grafted' );

    var setSOAPPort = true;

    // Load file if specified
    if ( this.config.loadFile ) {
        log.info( 'Loading save file ' + this.config.loadFile );
        var load = switcher.load_history_from_scratch( this.config.loadFile );
        if ( load == 'true' ) {
            log.info( 'Save file loaded.' );
            setSOAPPort = false;
        } else {
            log.warn( 'Save file not found!' );
        }
    }

    async.series( [

        function ( callback ) {
            if ( setSOAPPort ) {
                log.debug( 'Setting SOAP port...' );
                // Validate SOAP port and this.configure quiddity, otherwise fail
                checkPort( 'SOAP', self.config.soap, function ( error ) {
                    if ( error ) {
                        log.error( error );
                        callback( error );
                        return process.exit();
                    }
                    switcher.invoke( "soap", "set_port", [self.config.soap.port] );
                    callback();
                } );
            } else {
                callback();
            }
        },

        function ( callback ) {
            // Initialize managers
            self.quiddityManager.initialize();
            self.sipManager.initialize();
            self.receiverManager.initialize();
            callback();
        }

    ], function ( error ) {
        if ( error ) {
            log.error( error );
        }
        callback();
    } );
};

/**
 * Binds a new client socket
 *
 * @param socket
 */
SwitcherController.prototype.bindClient = function ( socket ) {
    socket.on( "getFiles", this.getSaveFiles.bind( this ) );
    socket.on( "loadFile", this.loadSaveFile.bind( this ) );
    socket.on( "saveFile", this.saveFile.bind( this ) );
    //
    //
    //
    socket.on( "deleteFile", this.remove_save.bind( this ) );

    this.quiddityManager.bindClient( socket );
    this.sipManager.bindClient( socket );
    this.receiverManager.bindClient( socket );
};

//   ██████╗ █████╗ ██╗     ██╗     ██████╗  █████╗  ██████╗██╗  ██╗███████╗
//  ██╔════╝██╔══██╗██║     ██║     ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝
//  ██║     ███████║██║     ██║     ██████╔╝███████║██║     █████╔╝ ███████╗
//  ██║     ██╔══██║██║     ██║     ██╔══██╗██╔══██║██║     ██╔═██╗ ╚════██║
//  ╚██████╗██║  ██║███████╗███████╗██████╔╝██║  ██║╚██████╗██║  ██╗███████║
//   ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝

/**
 * Switcher Log Callback
 *
 * @param message
 * @private
 */
SwitcherController.prototype._onSwitcherLog = function ( message ) {
    log.switcher( message );
};

//  ██╗     ██╗███████╗███████╗ ██████╗██╗   ██╗ ██████╗██╗     ███████╗
//  ██║     ██║██╔════╝██╔════╝██╔════╝╚██╗ ██╔╝██╔════╝██║     ██╔════╝
//  ██║     ██║█████╗  █████╗  ██║      ╚████╔╝ ██║     ██║     █████╗
//  ██║     ██║██╔══╝  ██╔══╝  ██║       ╚██╔╝  ██║     ██║     ██╔══╝
//  ███████╗██║██║     ███████╗╚██████╗   ██║   ╚██████╗███████╗███████╗
//  ╚══════╝╚═╝╚═╝     ╚══════╝ ╚═════╝   ╚═╝    ╚═════╝╚══════╝╚══════╝

/**
 * Close the server
 * Sends a shutdown message to every client
 */
SwitcherController.prototype.close = function () {
    log.info( "Server scenic is now closed" );
    if ( this.io ) {
        this.io.emit( "shutdown", true );
    }
    switcher.close();
};

//  ██████╗  ██████╗  ██████╗██╗   ██╗███╗   ███╗███████╗███╗   ██╗████████╗███████╗
//  ██╔══██╗██╔═══██╗██╔════╝██║   ██║████╗ ████║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
//  ██║  ██║██║   ██║██║     ██║   ██║██╔████╔██║█████╗  ██╔██╗ ██║   ██║   ███████╗
//  ██║  ██║██║   ██║██║     ██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
//  ██████╔╝╚██████╔╝╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║   ██║   ███████║
//  ╚═════╝  ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝

/**
 * Get scenic files list
 *
 * @param cb
 */
SwitcherController.prototype.getSaveFiles = function ( cb ) {
    fs.readdir( this.config.scenicSavePath, function ( error, files ) {
        if ( error ) {
            return logback( error, cb );
        }
        cb( null, files );
    } );
};

/**
 * Load scenic file
 *
 * @param name
 * @param cb
 */
SwitcherController.prototype.loadSaveFile = function ( name, cb ) {
    var path = this.config.scenicSavePath + name;
    log.debug( "Loading scenic file: " + path );
    try {
        var load = switcher.load_history_from_scratch( path );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !load || load == 'false' ) {
        return logback( 'Failed to load file ' + path, cb );
    }
    log.info( "Loaded scenic file: " + path );
    cb();
};

/**
 * Save scenic file
 *
 * @param name
 * @param cb
 */
SwitcherController.prototype.saveFile = function ( name, cb ) {
    var path = this.config.scenicSavePath + name;
    log.debug( "Saving scenic file: " + path );
    try {
        var save = switcher.save_history( path );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !save || save == 'false' ) {
        return logback( 'Failed to save file ' + path, cb );
    }
    log.info( "Saved scenic file: " + path );
    cb();
};


/**
 * Remove scenic file
 *
 * @param name
 * @param cb
 */
SwitcherController.prototype.remove_save = function ( name, cb ) {
    var path = this.config.scenicSavePath + name;
    log.debug( "Removing scenic file: " + path );
    var fs   = require( 'fs' );
    fs.unlink( path, function ( err ) {
        if ( err ) {
            log.warn( err );
            return cb( err );
        }
        cb();
    } );
};


module.exports = SwitcherController;