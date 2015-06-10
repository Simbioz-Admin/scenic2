"use strict";

var fs              = require( 'fs' );
var _               = require( 'underscore' );
var i18n            = require( 'i18next' );
var async           = require( 'async' );
var switcher        = require( 'switcher' );
var SipManager      = require( './SipManager' );
var QuiddityManager = require( './QuiddityManager' );
var RtpManager      = require( './RtpManager' );
var log             = require( '../lib/logger' );
var logback         = require( '../utils/logback' );
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
    this.switcher = new switcher.Switcher( 'scenic', this._onSwitcherLog.bind( this ) );

    this.quiddityManager = new QuiddityManager( config, this.switcher, io );
    this.sipManager      = new SipManager( config, this.switcher, io );
    this.rtpManager = new RtpManager( config, this.switcher, io );
}

/**
 * Initialize
 * Sets up the default Scenic environment
 *
 * @param callback
 */
SwitcherController.prototype.initialize = function ( callback ) {

    log.debug( "Initializing Switcher Controller..." );

    var self = this;

    // Switcher Callbacks
    this.switcher.register_prop_callback( this._onSwitcherProperty.bind( this ) );
    this.switcher.register_signal_callback( this._onSwitcherSignal.bind( this ) );

    /**
     * DEFAULTS
     */

    log.debug( 'Setting up system...' );

    // SOAP Control
    log.debug( 'Creating SOAP Control Server...' );
    this.switcher.create( 'SOAPcontrolServer', this.config.soap.quiddName );

    // Create the default quiddities necessary to use switcher
    log.debug( 'Creating RTP Session...' );
    this.switcher.create( 'rtpsession', this.config.rtp.quiddName );

    // Create quiddity systemusage to get information about the CPU usage
    // System usage is a private quiddity so we manually subscribe to it events
    log.debug( 'Creating System Usage...' );
    this.switcher.create( 'systemusage', this.config.systemUsage.quiddName );
    this.switcher.set_property_value( this.config.systemUsage.quiddName, 'period', String( this.config.systemUsage.period ) );
    this.switcher.subscribe_to_signal( this.config.systemUsage.quiddName, 'on-tree-grafted' );

    var setSOAPPort = true;

    // Load file if specified
    if ( this.config.loadFile ) {
        log.info( 'Loading save file ' + this.config.loadFile );
        var loaded = this.switcher.load_history_from_scratch( this.config.loadFile );
        if ( loaded ) {
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
                    self.switcher.invoke( self.config.soap.quiddName, 'set_port', [self.config.soap.port] );
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
            self.rtpManager.initialize();
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
    socket.on( "deleteFile", this.deleteFile.bind( this ) );

    this.quiddityManager.bindClient( socket );
    this.sipManager.bindClient( socket );
    this.rtpManager.bindClient( socket );
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

/**
 * Switcher Property Callback
 *
 * @param quiddityId
 * @param property
 * @param value
 * @private
 */
SwitcherController.prototype._onSwitcherProperty = function ( quiddityId, property, value ) {
    this.quiddityManager.onSwitcherProperty( quiddityId, property, value );
    this.rtpManager.onSwitcherProperty( quiddityId, property, value );
    this.sipManager.onSwitcherProperty( quiddityId, property, value );
};

/**
 * Switcher Signal Callback
 *
 * @param quiddityId
 * @param signal
 * @param value
 * @private
 */
SwitcherController.prototype._onSwitcherSignal = function ( quiddityId, signal, value ) {
    this.quiddityManager.onSwitcherSignal( quiddityId, signal, value );
    this.rtpManager.onSwitcherSignal( quiddityId, signal, value );
    this.sipManager.onSwitcherSignal( quiddityId, signal, value );

    //  ┌─┐┬ ┬┌─┐┌┬┐┌─┐┌┬┐  ┬ ┬┌─┐┌─┐┌─┐┌─┐
    //  └─┐└┬┘└─┐ │ ├┤ │││  │ │└─┐├─┤│ ┬├┤
    //  └─┘ ┴ └─┘ ┴ └─┘┴ ┴  └─┘└─┘┴ ┴└─┘└─┘

    if ( signal == 'on-tree-grafted' && quiddityId == this.config.systemUsage.quiddName ) {
        var info = this.switcher.get_info( quiddityId, value[0] );
        this.io.emit( 'systemusage', info );
    }
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
    log.info( "Closing Scenic server..." );
    if ( this.io ) {
        this.io.emit( 'shutdown' );
    }
    this.switcher.close();
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
    var path = this.config.savePath;
    try {
        fs.readdir( path, function ( error, files ) {
            if ( error ) {
                return logback( i18n.t( 'Failed to read save files from __path__ (__error__)', {
                    path:  path,
                    error: error
                } ), cb );
            }
            cb( null, files );
        } );
    } catch ( e ) {
        return logback( i18n.t('Error while reading save files from __path__ (__error__)', {path: path, error: e.toString()}), cb);

    }
};

/**
 * Load scenic file
 *
 * @param name
 * @param cb
 */
SwitcherController.prototype.loadSaveFile = function ( name, cb ) {
    var path = this.config.savePath + name;
    log.debug( "Loading scenic file: " + path );
    try {
        var loaded = this.switcher.load_history_from_scratch( path );
    } catch ( e ) {
        return logback( i18n.t('Error while loading file __path__ (__error__)', {path: path, error: e.toString()}), cb );

    }
    if ( !loaded ) {
        return logback( i18n.t('Failed to load file __path__', {path: path} ), cb );
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
    var path = this.config.savePath + name;
    log.debug( "Saving scenic file: " + path );
    try {
        var save = this.switcher.save_history( path );
    } catch ( e ) {
        return logback( i18n.t('Error while saving file __path__ (__error__)', {path: path, error: e.toString()}), cb );
    }
    if ( !save ) {
        return logback( i18n.t('Failed to save file __path__', {path: path}), cb );
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
SwitcherController.prototype.deleteFile = function ( name, cb ) {
    var path = this.config.savePath + name;
    log.debug( "Removing scenic file: " + path );
    try {
        fs.unlink( path, function ( error ) {
            if ( error ) {
                return logback( i18n.t('Error while deleting file __path__ (__error__)', {path:path, error: error}), cb);
            }
            cb();
        } );
    } catch ( e ) {
        return logback( i18n.t('Failed to delete file __path__ (__error__)', {path: path, error: e.toString()}), cb);
    }
};

module.exports = SwitcherController;