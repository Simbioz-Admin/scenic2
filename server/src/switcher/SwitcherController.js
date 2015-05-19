"use strict";

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

    this.vuMeters = [];

    this.quiddityManager = new QuiddityManager( config, switcher, io );
    this.sipManager      = new SipManager( config, switcher, io );
    this.receiverManager = new ReceiverManager( config, switcher, io );
}

/**
 * Initialize
 *
 * @param callback
 */
SwitcherController.prototype.initialize = function ( callback ) {

    log.debug( "Initializing Switcher..." );

    var self = this;

    // Switcher Callbacks
    switcher.register_log_callback( this._onSwitcherLog.bind( this ) );
    switcher.register_prop_callback( this._onSwitcherProperty.bind( this ) );
    switcher.register_signal_callback( this._onSwitcherSignal.bind( this ) );

    /**
     * DEFAULTS
     */

    log.debug( 'Setting up system...' );

    // SOAP Control
    log.debug( 'Creating SOAP Control Server...' );
    switcher.create( "SOAPcontrolServer", "soap" );

    // Create the default quiddities necessary to use switcher
    log.debug( 'Creating RTP Session...' );
    switcher.create( "rtpsession", this.config.rtpsession );

    // Create quiddity systemusage to get information about the CPU usage
    log.debug( 'Creating System Usage...' );
    switcher.create( "systemusage", 'systemusage' );
    switcher.set_property_value( "systemusage", "period", this.config.systemusagePeriod );
    switcher.subscribe_to_signal( 'systemusage', "on-tree-grafted" );
    //switcher.subscribe_to_signal( 'systemusage', "on-tree-pruned" );

    var setSOAPPort = true;
    if ( this.config.loadFile ) {
        log.info( "Loading save file " + this.config.loadFile );
        var load = switcher.load_history_from_scratch( this.config.loadFile );
        if ( load == "true" ) {
            log.info( "Save file loaded." );
            setSOAPPort = false;
        } else {
            log.error( "Save file not found!" );
        }
    }

    async.series( [

        function ( callback ) {
            if ( setSOAPPort ) {
                log.debug( 'Setting SOAP port...' );
                // Validate SOAP port and this.configure quiddity, otherwise fail
                checkPort( 'SOAP', self.config.soap, function ( error ) {
                    if ( error ) {
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

            // Create default dico
            log.debug( 'Creating Dictionaries...' );
            var dico = switcher.create( "dico", "dico" );
            switcher.invoke( dico, "update", ["controlDestinations", "[]"] );
            switcher.invoke( dico, "update", ["rtpDestinations", "[]"] );

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
    socket.on( "listControlDestinations", this.listControlDestinations.bind( this ) );
    //
    //
    //
    socket.on( "save", this.save.bind( this ) );
    socket.on( "load", this.load.bind( this ) );
    socket.on( "remove_save", this.remove_save.bind( this ) );
    socket.on( "get_save_file_list", this.get_save_file_list.bind( this ) );

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

/**
 * Switcher Property Callback
 *
 * @param quiddityId
 * @param property
 * @param value
 * @private
 */
SwitcherController.prototype._onSwitcherProperty = function ( quiddityId, property, value ) {
    // Dispatch to quiddity manager
    this.quiddityManager._onSwitcherProperty( quiddityId, property, value );
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

    // We exclude byte-rate from debug because it dispatches every second
    if ( quiddityId != "systemusage" ) {
        log.debug( 'Signal:', quiddityId + '.' + signal + '=' + value );
    }

    //  ┌┬┐┬─┐┌─┐┌─┐  ┌─┐┬─┐┌─┐┌─┐┌┬┐┌─┐┌┬┐
    //   │ ├┬┘├┤ ├┤   │ ┬├┬┘├─┤├┤  │ ├┤  ││
    //   ┴ ┴└─└─┘└─┘  └─┘┴└─┴ ┴└   ┴ └─┘─┴┘

    if ( quiddityId != "systemusage" && signal == "on-tree-grafted" ) {

        // Shmdata Writer
        if ( value[0].indexOf( ".shmdata.writer" ) >= 0 ) {
            var shmdataWriterInfo   = JSON.parse( switcher.get_info( quiddityId, value[0] ) );
            shmdataWriterInfo.path  = value[0].replace( ".shmdata.writer.", "" );
            shmdataWriterInfo.quidd = quiddityId;
            shmdataWriterInfo.type  = "writer";

            // VU Meters
            log.debug( "Creating VU meters for " + quiddityId );
            var shmdataWriters      = JSON.parse( switcher.get_info( quiddityId, ".shmdata.writer" ) );
            _.each( shmdataWriters, function ( shmdata, name ) {
                log.debug( 'Creating VU meter for shmdata ' + name );
                var vuMeter = switcher.create( "fakesink", "vumeter_" + name );
                if ( vuMeter ) {
                    this.vuMeters.push( {quiddity: quiddityId, path: vuMeter} );
                    switcher.invoke( vuMeter, "connect", [name] );
                } else {
                    log.warn( 'Could not create VU Meter for ' + name );
                }
            }, this );
            this.io.emit( "addShmdata", quiddityId, shmdataWriterInfo );
        }

        // Shmdata Reader
        if ( value[0].indexOf( ".shmdata.reader" ) >= 0 ) {
            var shmdataReaderInfo   = JSON.parse( switcher.get_info( quiddityId, value[0] ) );
            shmdataReaderInfo.path  = value[0].replace( ".shmdata.reader.", "" );
            shmdataReaderInfo.quidd = quiddityId;
            shmdataReaderInfo.type  = "reader";
            this.io.emit( "addShmdata", quiddityId, shmdataReaderInfo );
        }

        // TODO: SIP
        if ( quiddityId == this.config.sip.quiddName && value[0].indexOf( ".buddy" ) >= 0 ) {
            //TODO : Get Better method for get information about user without split value
            var idUser   = value[0].split( "." )[2];
            var infoUser = JSON.parse( switcher.get_info( quiddityId, '.buddy.' + idUser ) );
            this.io.emit( 'infoUser', infoUser );
        }
    }

    //  ┌┬┐┬─┐┌─┐┌─┐  ┌─┐┬─┐┬ ┬┌┐┌┌─┐┌┬┐
    //   │ ├┬┘├┤ ├┤   ├─┘├┬┘│ ││││├┤  ││
    //   ┴ ┴└─└─┘└─┘  ┴  ┴└─└─┘┘└┘└─┘─┴┘

    if ( quiddityId != "systemusage" && signal == "on-tree-pruned" ) {

        // Shmdata Writer
        if ( value[0].indexOf( ".shmdata.writer" ) >= 0 ) {
            this.io.emit( "removeShmdata", quiddityId, {
                path: value[0].replace( ".shmdata.writer.", "" ),
                type: 'writer'
            } );
        }

        // Shmdata Reader
        if ( value[0].indexOf( ".shmdata.reader" ) >= 0 ) {
            this.io.emit( "removeShmdata", quiddityId, {
                path: value[0].replace( ".shmdata.reader.", "" ),
                type: 'reader'
            } );
        }

        //TODO: SIP
        if ( quiddityId == this.config.sip.quiddName ) {
            var idUser   = value[0].split( "." )[2];
            var infoUser = JSON.parse( switcher.get_info( quiddityId, '.buddy.' + idUser ) );
            this.io.emit( 'infoUser', infoUser );
        }
    }

    //  ┌─┐ ┬ ┬┬┌┬┐┌┬┐┬┌┬┐┬ ┬  ┌─┐┬─┐┌─┐┌─┐┌┬┐┌─┐┌┬┐
    //  │─┼┐│ ││ ││ │││ │ └┬┘  │  ├┬┘├┤ ├─┤ │ ├┤  ││
    //  └─┘└└─┘┴─┴┘─┴┘┴ ┴  ┴   └─┘┴└─└─┘┴ ┴ ┴ └─┘─┴┘

    if ( signal == "on-quiddity-created" ) {
        // Forward to quiddity manager
        this.quiddityManager._onAdded( value[0] );
    }

    //  ┌─┐ ┬ ┬┬┌┬┐┌┬┐┬┌┬┐┬ ┬  ┬─┐┌─┐┌┬┐┌─┐┬  ┬┌─┐┌┬┐
    //  │─┼┐│ ││ ││ │││ │ └┬┘  ├┬┘├┤ ││││ │└┐┌┘├┤  ││
    //  └─┘└└─┘┴─┴┘─┴┘┴ ┴  ┴   ┴└─└─┘┴ ┴└─┘ └┘ └─┘─┴┘

    if ( signal == "on-quiddity-removed" ) {
        // Forward to quiddity manager
        this.quiddityManager._onRemoved( value[0] );
    }

    //  ┌─┐┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐┬ ┬  ┌─┐┌┬┐┌┬┐┌─┐┌┬┐
    //  ├─┘├┬┘│ │├─┘├┤ ├┬┘ │ └┬┘  ├─┤ ││ ││├┤  ││
    //  ┴  ┴└─└─┘┴  └─┘┴└─ ┴  ┴   ┴ ┴─┴┘─┴┘└─┘─┴┘

    if ( signal == "on-property-added" ) {
        log.debug( "Subscribing to property", quiddityId, value[0] );
        switcher.subscribe_to_property( quiddityId, value[0] );
    }

    //  ┌─┐┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐┬ ┬  ┬─┐┌─┐┌┬┐┌─┐┬  ┬┌─┐┌┬┐
    //  ├─┘├┬┘│ │├─┘├┤ ├┬┘ │ └┬┘  ├┬┘├┤ ││││ │└┐┌┘├┤  ││
    //  ┴  ┴└─└─┘┴  └─┘┴└─ ┴  ┴   ┴└─└─┘┴ ┴└─┘ └┘ └─┘─┴┘

    if ( signal == "on-property-removed" ) {

    }

    //  ┌─┐┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐┬ ┬  ┬┌┐┌┌─┐┌─┐
    //  ├─┘├┬┘│ │├─┘├┤ ├┬┘ │ └┬┘  ││││├┤ │ │
    //  ┴  ┴└─└─┘┴  └─┘┴└─ ┴  ┴   ┴┘└┘└  └─┘

    if ( signal == "on-property-added" || signal == "on-property-removed" || signal == "on-method-added" || signal == "on-method-removed" ) {
        this.io.emit('signals_properties_info', quiddityId, signal, value[0] );
    }

    //  ┌─┐┬ ┬┌─┐┌┬┐┌─┐┌┬┐  ┬ ┬┌─┐┌─┐┌─┐┌─┐
    //  └─┐└┬┘└─┐ │ ├┤ │││  │ │└─┐├─┤│ ┬├┤
    //  └─┘ ┴ └─┘ ┴ └─┘┴ ┴  └─┘└─┘┴ ┴└─┘└─┘

    if ( quiddityId == "systemusage" && signal == "on-tree-grafted" ) {
        var info = switcher.get_info( quiddityId, value[0] );
        this.io.emit( "systemusage", info );
    }
};


//  ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗ ███████╗
//  ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝
//  ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝███████╗
//  ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗╚════██║
//  ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║███████║
//  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
//

/**
 * List Control Destinations
 *
 * @param cb
 * @returns {*}
 */
SwitcherController.prototype.listControlDestinations = function ( cb ) {
    log.debug( 'Getting control destinations' );
    try {
        var destinations = this.switcher.invoke( 'dico', 'read', ['controlDestinations'] );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !destinations ) {
        return logback( i18n.t( 'Could not list Control Destinations' ), cb );
    }
    cb( null, destinations );
};

//  ██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗
//  ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝
//  ██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝
//  ██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝
//  ███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║
//  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝
//


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
 * Save scenic file
 *
 * @param name
 * @param cb
 */
SwitcherController.prototype.save = function ( name, cb ) {
    var path = this.config.scenicSavePath + name;
    log.debug( "Saving scenic file: " + path );
    var save = switcher.save_history( path );
    cb( save );
};

/**
 * Load scenic file
 *
 * @param name
 * @param cb
 */
SwitcherController.prototype.load = function ( name, cb ) {
    var path = this.config.scenicSavePath + name;
    log.debug( "Loading scenic file: " + path );
    var load = switcher.load_history_from_scratch( path );
    cb( load );
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

/**
 * Get scenic files list
 *
 * @param cb
 */
SwitcherController.prototype.get_save_file_list = function ( cb ) {
    var fs = require( 'fs' );
    fs.readdir( this.config.scenicSavePath, function ( err, dir ) {
        if ( err ) {
            log.error( err );
            return;
        }
        cb( dir );
    } );
};

module.exports = SwitcherController;