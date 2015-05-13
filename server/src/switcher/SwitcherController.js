"use strict";

var _               = require( 'underscore' );
var i18n            = require( 'i18next' );
var async           = require( 'async' );
var switcher        = require( 'switcher' );
var SipManager      = require( './SipManager' );
var QuiddityManager = require( './QuiddityManager' );
var ReceiverManager = require( './ReceiverManager' );
var log             = require( '../lib/logger' );
var checkPort       = require( '../utils/check-port' );

/**
 * Constructor
 *
 * @constructor
 */
function SwitcherController( config, io ) {
    this.config          = config;
    this.io              = io;
    this.quiddityManager = new QuiddityManager( config, switcher, io );
    this.sipManager      = new SipManager( config, switcher, io );
    this.receiverManager = new ReceiverManager( config, switcher, io );
}

/**
 * Initialize
 *
 * @param cfg
 * @param socketIo
 * @param callback
 */
SwitcherController.prototype.initialize = function ( callback ) {

    log.debug( "Initializing Switcher..." );

    var self = this;

    // Switcher Callbacks
    switcher.register_log_callback( this.onSwitcherLog.bind( this ) );
    switcher.register_prop_callback( this.onSwitcherProperty.bind( this ) );
    switcher.register_signal_callback( this.onSwitcherSignal.bind( this ) );

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
    switcher.subscribe_to_signal( 'systemusage', "on-tree-pruned" );

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
            switcher.invoke( dico, "update", ["controlProperties", "[]"] );
            switcher.invoke( dico, "update", ["destinationsRtp", "[]"] );

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
 */
SwitcherController.prototype.onSwitcherLog = function ( message ) {
    log.switcher( message );
};

/**
 * Switcher Property Callback
 *
 * @param qname
 * @param qprop
 * @param pvalue
 */
SwitcherController.prototype.onSwitcherProperty = function ( qname, qprop, pvalue ) {

    var self = this;

    //we exclude byte-reate because its call every second (almost a spam...)
    if ( qprop != "byte-rate" && qprop != "caps" ) {
        log.debug( '...PROP...: ', qname, ' ', qprop, ' ', pvalue );
    } else {
        this.io.emit( "signals_properties_value", qname, qprop, pvalue );
    }


    /* ************ PROP - SIPQUID ************ */

    if ( qprop == "sip-registration" && qname == this.config.sip.quiddName ) {
        log.debug( "Sip Registration", pvalue );
    }

    /* ************ PROP - STARTED ************ */

    if ( qprop == "started" && pvalue == "false" ) {

        log.debug( "remove shmdata of", qname );
        var destinations = switcher.get_property_value( "dico", "destinations" ),
            destinations = JSON.parse( destinations );

        _.each( destinations, function ( dest ) {
            _.each( dest.data_streams, function ( stream ) {
                log.debug( stream.quiddName, qname );
                if ( stream.quiddName == qname ) {
                    log.debug( "find quidd connected!", stream.path, stream.port );
                    receivers.remove_connection( stream.path, dest.id );
                }
            } );
        } );

        /* check if another quiddities is associate to */
        var quidds = JSON.parse( switcher.get_quiddities_description() ).quiddities;
        _.each( quidds, function ( quidd ) {
            if ( quidd.name.indexOf( "sink_" ) >= 0 && quidd.name.indexOf( qname ) >= 0 ) {
                log.debug( "remove sink", quidd.name );
                switcher.remove( quidd.name );
            }
        } );

    }

    /* broadcast all the modification on properties */
    _.each( this.config.subscribe_quidd_info, function ( quiddName, socketId ) {
        if ( quiddName == qname ) {
            var socket = self.io.sockets.sockets[socketId];
            if ( socket ) {
                socket.emit( "signals_properties_value", qname, qprop, pvalue );
            }
        }
    } );
};

/**
 * Switcher Signal Callback
 *
 * @param qname
 * @param qsignal
 * @param pvalue
 */
SwitcherController.prototype.onSwitcherSignal = function ( qname, qsignal, pvalue ) {

    var self = this;

    if ( qname != "systemusage" ) {
        log.debug( 'signal:', qname, qsignal, pvalue );
    }

    /* manage callback fro SIP quidd  */

    // if (qname == "sipquid" && qsignal == "on-tree-grafted") {
    //   sip.updateInfoUser(switcher.get_info(qname, pvalue[0]));
    // }
    // if (qname == "sipquid" && qsignal == "on-tree-pruned") {
    //   sip.removeFromList(switcher.get_info(qname, pvalue[0]));

    // }

    /* ON TREE GRAFTED */

    if ( qname != "systemusage" && qsignal == "on-tree-grafted" ) {

        /* shmdata writer */

        if ( pvalue[0].indexOf( ".shmdata.writer" ) >= 0 ) {
            var shmdatasInfo = JSON.parse( switcher.get_info( qname, pvalue[0] ) );
            /* temporary add name in info (request for add by default) */
            shmdatasInfo["path"]  = pvalue[0].replace( ".shmdata.writer.", "" );
            shmdatasInfo['quidd'] = qname;
            shmdatasInfo['type']  = "writer";
            this.createVuMeter( qname );
            this.io.emit( "addShmdata", qname, shmdatasInfo );
        }

        /* Shmdata reader */

        if ( pvalue[0].indexOf( ".shmdata.reader" ) >= 0 ) {
            var shmdatasInfo      = JSON.parse( switcher.get_info( qname, pvalue[0] ) );
            shmdatasInfo["path"]  = pvalue[0].replace( ".shmdata.reader.", "" );
            shmdatasInfo['type']  = "reader";
            shmdatasInfo['quidd'] = qname;
            this.io.emit( "addShmdata", qname, shmdatasInfo );
        }

        /* sipquidd */

        if ( qname == this.config.sip.quiddName && pvalue[0].indexOf( ".buddy" ) >= 0 ) {
            //TODO : Get Better method for get information about user without split value
            var idUser   = pvalue[0].split( "." )[2];
            var infoUser = JSON.parse( switcher.get_info( qname, '.buddy.' + idUser ) );
            this.io.emit( 'infoUser', infoUser );
        }


    }


    /* ON TREE PRUNED */

    if ( qname != "systemusage" && qsignal == "on-tree-pruned" ) {

        //Shmdata Writer
        if ( pvalue[0].indexOf( ".shmdata.writer" ) >= 0 ) { //writer
            var shmdata = {
                path: pvalue[0].replace( ".shmdata.writer.", "" ),
                type: 'writer'
            };

            this.io.emit( "removeShmdata", qname, shmdata );
        }

        //Shmdata Reader
        if ( pvalue[0].indexOf( ".shmdata.reader" ) >= 0 ) { //writer
            var shmdata = {
                path: pvalue[0].replace( ".shmdata.reader.", "" ),
                type: 'reader'
            };

            this.io.emit( "removeShmdata", qname, shmdata );
        }

        if ( qname == this.config.sip.quiddName ) {
            var idUser   = pvalue[0].split( "." )[2];
            var infoUser = JSON.parse( switcher.get_info( qname, '.buddy.' + idUser ) );
            this.io.emit( 'infoUser', infoUser );
        }
    }


    /* manage callback fro systemusage quidd  */

    if ( qname == "systemusage" && qsignal == "on-tree-grafted" ) {
        var info = switcher.get_info( qname, pvalue[0] );
        // log.debug("systemusage info", switcher.get_info(qname, pvalue[0]));
        this.io.emit( "systemusage", info );
    }


    /* ************ SIGNAL - ON QUIDDITY CREATED ************ */

    if ( qsignal == "on-quiddity-created" ) {

        var quiddClass = JSON.parse( switcher.get_quiddity_description( pvalue[0] ) );
        if ( !_.contains( this.config.quiddExclude, quiddClass.class ) ) {

            /* subscribe signal for properties add/remove and methods add/remove */
            switcher.subscribe_to_signal( pvalue[0], "on-property-added" );
            switcher.subscribe_to_signal( pvalue[0], "on-property-removed" );
            switcher.subscribe_to_signal( pvalue[0], "on-method-added" );
            switcher.subscribe_to_signal( pvalue[0], "on-method-removed" );
            switcher.subscribe_to_signal( pvalue[0], "on-connection-tried" );

            /*subscribe to the modification on this quiddity systemusage*/
            switcher.subscribe_to_signal( pvalue[0], "on-tree-grafted" );
            switcher.subscribe_to_signal( pvalue[0], "on-tree-pruned" );

            /* we subscribe all properties of quidd created */
            try {
                var propDecription = switcher.get_properties_description( pvalue[0] );
                var properties     = JSON.parse( switcher.get_properties_description( pvalue[0] ) ).properties;
                _.each( properties, function ( property ) {
                    switcher.subscribe_to_property( pvalue[0], property.name );
                    log.debug( "Subscribed to", pvalue[0], property.name );
                } );
            } catch ( e ) {
                log.error( "Error getting properties", e );
            }


            /* cehck if the quiddity is created by interface and send all except user created this */
            //FIXME: socket.io removed except in 1.0
            var socketIdCreatedThisQuidd = false;
            /*_.each(this.config.listQuiddsAndSocketId, function(socketId, quiddName) {
             if (quiddName == pvalue[0])
             socketIdCreatedThisQuidd = socketId;
             delete this.config.listQuiddsAndSocketId[quiddName];
             });*/
            if ( socketIdCreatedThisQuidd ) {
                console.log( this.io.sockets.clients() );
                this.io.except( socketIdCreatedThisQuidd ).emit( "create", quiddClass );
            } else {
                this.io.emit( "create", quiddClass );
            }
        }
    }

    /* ************ SIGNAL - ON QUIDDITY REMOVED ************ */

    /* Emits to users a quiddity is removed */
    if ( qsignal == "on-quiddity-removed" ) {

        this.io.emit( "remove", pvalue );
        log.debug( "the quiddity " + pvalue + " is removed" );
        this.quiddityManager.removeElementsAssociateToQuiddRemoved( pvalue[0] );
    }

    if ( qsignal == "on-property-added" || qsignal == "on-property-removed" || qsignal == "on-method-added" || qsignal == "on-method-removed" ) {

        log.debug( "subscribe List", this.config.subscribe_quidd_info );
        _.each( this.config.subscribe_quidd_info, function ( quiddName, socketId ) {
            if ( quiddName == qname ) {
                log.debug( "Sending to socket", socketId, qsignal, pvalue );
                var socket = self.io.sockets.sockets[socketId];
                if ( socket ) {
                    socket.emit( 'signals_properties_info', qsignal, qname, pvalue );
                }
            }
        } );

    }

    /* ************ SIGNAL - ON PROPERTY ADDED ************ */

    /* subscribe to the property added */
    if ( qsignal == "on-property-added" ) {
        log.debug( "Subscribing to property", qname, pvalue[0] );
        switcher.subscribe_to_property( qname, pvalue[0] );
    }

    /* ************ SIGNAL - ON PROPERTY REMOVED ************ */

    if ( qsignal == "on-property-removed" ) {
        log.debug( "Unsubscribing from property", qname, pvalue[0] );
        switcher.unsubscribe_to_property( qname, pvalue[0] );
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
    log.info( "Server scenic is now closed" );
    if ( this.io ) {
        this.io.emit( "shutdown", true );
    }
    switcher.close();
};

//  ███╗   ███╗██╗███████╗ ██████╗
//  ████╗ ████║██║██╔════╝██╔════╝
//  ██╔████╔██║██║███████╗██║
//  ██║╚██╔╝██║██║╚════██║██║
//  ██║ ╚═╝ ██║██║███████║╚██████╗
//  ╚═╝     ╚═╝╚═╝╚══════╝ ╚═════╝

/**
 *  Creating a view meter for viewing continuously from the
 *  interface if the video and audio streams are sent or received
 *
 *  @param {string} quiddName The name (id) of the quiddity
 */

SwitcherController.prototype.createVuMeter = function ( quiddName ) {
    log.debug( "Creating VU Meters for " + quiddName );
    var shmdatas = JSON.parse( switcher.get_info( quiddName, ".shmdata.writer" ) );
    _.each( shmdatas, function ( shmdata, name ) {
        var vumeter = switcher.create( "fakesink", "vumeter_" + name );
        if ( vumeter ) {
            switcher.invoke( vumeter, "connect", [name] );
            switcher.subscribe_to_property( vumeter, "byte-rate" );
        } else {
            log.warn( 'Could not create VU Meter for ' + name );
        }
    } );
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