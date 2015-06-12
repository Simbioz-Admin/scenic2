"use strict";

var fs              = require( 'fs' );
var path            = require('path');
var _               = require( 'underscore' );
var async           = require( 'async' );
var switcher        = require( 'switcher' );
var SipManager      = require( './SipManager' );
var QuiddityManager = require( './QuiddityManager' );
var RtpManager      = require( './RtpManager' );
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
    this.config   = config;
    this.io       = io;
    this.switcher = new switcher.Switcher( 'scenic', this._onSwitcherLog.bind( this ) );

    this.quiddityManager = new QuiddityManager( this );
    this.sipManager      = new SipManager( this );
    this.rtpManager      = new RtpManager( this );
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
    var filePath = this.config.savePath + name;
    log.info( 'Loading scenic file', filePath );
    var loaded = this.switcher.load_history_from_scratch( filePath );
    if ( !loaded ) {
        log.warn('Could not load scenic file', filePath);
    }
    return loaded;
};

/**
 * Save scenic file
 *
 * @param {String} name File name
 */
SwitcherController.prototype.saveFile = function ( name ) {
    // Just clean up dots, slashes, backslashes and messy filename stuff
    name = name.replace(/(\.|\/|\\|:|;)/g, '' );
    var filePath = this.config.savePath + name + '.json';
    log.info( 'Saving scenic file', filePath );
    var saved = this.switcher.save_history( filePath );
    if ( !saved ) {
        log.warn('Could not save scenic file', filePath);
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
    var filePath = this.config.savePath + name;
    log.info( 'Removing scenic file', filePath );
    try {
        fs.unlink( filePath, function ( error ) {
            if ( error ) {
                log.error( error );
                return cb( error );
            }
            cb();
        } );
    } catch ( e ) {
        log.error( e );
        return cb( e.toString() );
    }
};

module.exports = SwitcherController;