"use strict";

var fs              = require( 'fs' );
var path            = require( 'path' );
var _               = require( 'underscore' );
var async           = require( 'async' );
var switcher        = require( 'switcher' );
var SipManager      = require( './SipManager' );
var QuiddityManager = require( './QuiddityManager' );
var RtpManager      = require( './RtpManager' );
var ControlManager  = require( './ControlManager' );
var log             = require( '../lib/logger' );
var checkPort       = require( '../utils/check-port' );

/**
 * Constructor
 *
 * @param config
 * @param io
 * @constructor
 */
function SwitcherController( config, io ) {
    this.config = config;
    this.io     = io;

    // Namespace switcher with the scenic port from the config (if any, we silently ignore it otherwise) so that
    // multiple instances running on the same machine don't create shmdatas with conflicting names
    this.switcher = new switcher.Switcher( 'scenic' + ( ( config.scenic && config.scenic.port ) ? config.scenic.port : '' ), this._onSwitcherLog.bind( this ) );

    this.quiddityManager = new QuiddityManager( this );
    this.sipManager      = new SipManager( this );
    this.rtpManager      = new RtpManager( this );
    this.controlManager  = new ControlManager( this );
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

    // Create save file directory
    if ( !fs.existsSync( this.config.savePath ) ) {
        try {
            fs.mkdirSync( this.config.savePath );
        } catch ( err ) {
            console.error( "Could not create directory: " + this.config.savePath + " Error: " + err.toString() );
            return process.exit(1);
        }
    }

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
                    if ( self.config.soap.port == null ) {
                        log.error("SOAP Port Required.");
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
            self.controlManager.initialize();
            callback();
        }

    ], function ( error ) {
        if ( error ) {
            log.error( error );
        }
        callback();
    } );
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
    this.controlManager.onSwitcherProperty( quiddityId, property, value );
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
    this.controlManager.onSwitcherSignal( quiddityId, signal, value );
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
 * Clean file name in order to remove the risk of reading/writing
 * where not allowed on the file system
 *
 * @param {string} name - File name to clean
 * @returns {string} - Cleaned file name
 */
function cleanFileName( name ) {
    // Just clean up dots, slashes, backslashes and messy filename stuff
    return name.replace( /(\.|\/|\\|:|;)/g, '' );
}

/**
 * Get scenic files list
 *
 * TODO: Use promises instead of plain callback
 *
 * @param {Function} cb Callback
 */
SwitcherController.prototype.getFileList = function ( cb ) {
    var savePath = this.config.savePath;
    log.info( 'Getting scenic file list', savePath );
    try {
        fs.readdir( savePath, function ( error, files ) {
            if ( error ) {
                log.error( error );
                return cb( error );
            }
            files = _.map( _.filter( files, function( file ) {
                return path.extname( file ) == '.json';
            }), function ( file ) {
                var stat = fs.statSync( savePath + file );
                return {
                    name: file.replace( path.extname( file ), '' ),
                    date: new Date(stat.mtime)
                };
            } );
            cb( null, files );
        } );
    } catch ( e ) {
        log.error( e );
        return cb( e.toString() );
    }
};

/**
 * Load scenic file
 *
 * @param {String} name File name
 * @returns {Boolean} If the operation was successful
 */
SwitcherController.prototype.loadFile = function ( name ) {
    var fileName = cleanFileName( name );
    var filePath = this.config.savePath + fileName + '.json';
    log.info( 'Loading scenic file', filePath );
    this.io.emit( 'file.loading', fileName );
    var loaded   = this.switcher.load_history_from_scratch( filePath );
    if ( !loaded ) {
        log.warn( 'Could not load scenic file', filePath );
        this.io.emit( 'file.load.error', fileName );
    } else {
        log.info( 'Scenic file loaded', filePath );
        this.io.emit( 'file.loaded', fileName );
    }
    return loaded;
};

/**
 * Save scenic file
 *
 * @param {String} name File name
 */
SwitcherController.prototype.saveFile = function ( name ) {
    var fileName = cleanFileName( name );
    var filePath = this.config.savePath + fileName + '.json';
    log.info( 'Saving scenic file', filePath );
    var saved    = this.switcher.save_history( filePath );
    if ( !saved ) {
        log.warn( 'Could not save scenic file', filePath );
    } else {
        log.info( 'Scenic file saved', filePath );
        var file = {
            name: fileName,
            date: new Date(fs.statSync( filePath ).mtime)
        };
        this.io.emit( 'file.saved', file );
    }
    return saved;
};

/**
 * Remove scenic file
 *
 * TODO: Use promises instead of plain callback
 *
 * @param {String} name File name to delete
 * @param {Function} cb Callback
 */
SwitcherController.prototype.deleteFile = function ( name, cb ) {
    var self     = this;
    var fileName = cleanFileName( name );
    var filePath = this.config.savePath + fileName + '.json';
    log.info( 'Removing scenic file', filePath );
    try {
        fs.unlink( filePath, function ( error ) {
            if ( error ) {
                log.error( error );
                return cb( error );
            }
            log.info( 'Scenic file deleted', filePath );
            self.io.emit( 'file.deleted', fileName );
            cb();
        } );
    } catch ( e ) {
        log.error( e );
        return cb( e.toString() );
    }
};

module.exports = SwitcherController;