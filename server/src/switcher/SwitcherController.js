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
    this.config          = config;
    this.io              = io;
    this.switcher        = switcher;

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
    //switcher.subscribe_to_signal( 'systemusage', "on-tree-grafted" );
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
    var self = this;

    // We exclude byte-rate because it dispatches every second
    if ( property != "byte-rate" ) {
        log.debug( 'Property:', quiddityId + '.' + property + '=' + value );
    }




    // Send to clients
    // TODO: Redo subscription lists
    this.io.emit( "signals_properties_value", quiddityId, property, value );




    // If stopping a quiddity, check for associated shmdata and remove them
    if ( property == "started" && value == "false" ) {
        log.debug( 'A quiddity was stopped, removing VU meters...');
        this.vuMeters = _.filter( this.vuMeters, function ( vuMeter ) {
            if ( vuMeter.quiddity == quiddityId ) {
                log.debug( 'Removing VU meter: ' + vuMeter.path );
                this.switcher.remove( vuMeter.path );
                return false;
            } else {
                return true;
            }
        }, this );



        // Remove vu meter associated with quiddity
        /*try {
            var shmdataWriters = JSON.parse( this.switcher.get_info( quiddityId, "." ) );
        } catch ( e ) {
            log.error( e );
        }
        log.warn( shmdataWriters );
        if ( !shmdataWriters || shmdataWriters.error ) {
            log.error( shmdataWriters && shmdataWriters.error ? shmdataWriters.error : 'Could not get associated shmdatas.' );
        } else {
            _.each( shmdataWriters, function ( shmdata, index ) {
                console.log( shmdata, index );
                log.debug( 'Removing VU meter for ' + shmdata.path );
                this.switcher.remove( 'vumeter_' + shmdata.path );
            }, this );
        }*/


        //TODO: WHat does this do?
        var destinations = this.switcher.get_property_value( "dico", "destinations" ),
            destinations = JSON.parse( destinations );

        _.each( destinations, function ( dest ) {
            _.each( dest.data_streams, function ( stream ) {
                log.debug( 'DESTINATION DATA SCTREAM SOMETHING', stream.quiddName, quiddityId );
                if ( stream.quiddName == quiddityId ) {
                    log.debug( "find quidd connected!", stream.path, stream.port );
                    receivers.remove_connection( stream.path, dest.id );
                }
            } );
        } );

        /* check if another quiddities is associate to */
        var quidds = JSON.parse( this.switcher.get_quiddities_description() ).quiddities;
        _.each( quidds, function ( quidd ) {
            if ( quidd.name.indexOf( "sink_" ) >= 0 && quidd.name.indexOf( quiddityId ) >= 0 ) {
                log.debug( "WHAT IS THIS I DON'T EVEN? Remove sink", quidd.name );
                switcher.remove( quidd.name );
            }
        } );
    }












    /*if ( qprop != "byte-rate" && qprop != "caps" ) {
     log.debug( '...PROP...: ', qname, ' ', qprop, ' ', pvalue );
     } else {
     this.io.emit( "signals_properties_value", qname, qprop, pvalue );
     }*/


    /* ************ PROP - SIPQUID ************ */

    /*if ( qprop == "sip-registration" && qname == this.config.sip.quiddName ) {
        log.debug( "Sip Registration", pvalue );
    }*/

    /* broadcast all the modification on properties */
    /*_.each( this.config.subscribe_quidd_info, function ( quiddName, socketId ) {
        if ( quiddName == qname ) {
            var socket = self.io.sockets.sockets[socketId];
            if ( socket ) {
                socket.emit( "signals_properties_value", qname, qprop, pvalue );
            }
        }
    } );*/
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
    var self = this;

    // We exclude byte-rate because it dispatches every second
    if ( quiddityId != "systemusage" ) {
        log.debug( 'Signal:', quiddityId + '.' + signal + '=' + value );
    }











    /* manage callback fro SIP quidd  */

    // if (qname == "sipquid" && qsignal == "on-tree-grafted") {
    //   sip.updateInfoUser(switcher.get_info(qname, pvalue[0]));
    // }
    // if (qname == "sipquid" && qsignal == "on-tree-pruned") {
    //   sip.removeFromList(switcher.get_info(qname, pvalue[0]));

    // }

    /* ON TREE GRAFTED */

    if ( quiddityId != "systemusage" && signal == "on-tree-grafted" ) {

        /* shmdata writer */

        if ( value[0].indexOf( ".shmdata.writer" ) >= 0 ) {
            var shmdatasInfo = JSON.parse( switcher.get_info( quiddityId, value[0] ) );
            /* temporary add name in info (request for add by default) */
            shmdatasInfo["path"]  = value[0].replace( ".shmdata.writer.", "" );
            shmdatasInfo['quidd'] = quiddityId;
            shmdatasInfo['type']  = "writer";

            // VU Meters
            log.debug( "Creating VU meters for " + quiddityId );
            var shmdataWriters = JSON.parse( switcher.get_info( quiddityId, ".shmdata.writer" ) );
            _.each( shmdataWriters, function ( shmdata, name ) {
                log.debug( 'Creating VU meter for shmdata ' + name );
                var vuMeter = switcher.create( "fakesink", "vumeter_" + name );
                if ( vuMeter ) {
                    this.vuMeters.push( { quiddity: quiddityId, path: vuMeter } );
                    switcher.invoke( vuMeter, "connect", [name] );
                } else {
                    log.warn( 'Could not create VU Meter for ' + name );
                }
            }, this );

            this.io.emit( "addShmdata", quiddityId, shmdatasInfo );
        }

        /* Shmdata reader */

        if ( value[0].indexOf( ".shmdata.reader" ) >= 0 ) {
            var shmdatasInfo      = JSON.parse( switcher.get_info( quiddityId, value[0] ) );
            shmdatasInfo["path"]  = value[0].replace( ".shmdata.reader.", "" );
            shmdatasInfo['type']  = "reader";
            shmdatasInfo['quidd'] = quiddityId;
            this.io.emit( "addShmdata", quiddityId, shmdatasInfo );
        }

        /* sipquidd */

        if ( quiddityId == this.config.sip.quiddName && value[0].indexOf( ".buddy" ) >= 0 ) {
            //TODO : Get Better method for get information about user without split value
            var idUser   = value[0].split( "." )[2];
            var infoUser = JSON.parse( switcher.get_info( quiddityId, '.buddy.' + idUser ) );
            this.io.emit( 'infoUser', infoUser );
        }


    }


    /* ON TREE PRUNED */

    if ( quiddityId != "systemusage" && signal == "on-tree-pruned" ) {

        //Shmdata Writer
        if ( value[0].indexOf( ".shmdata.writer" ) >= 0 ) { //writer
            var shmdata = {
                path: value[0].replace( ".shmdata.writer.", "" ),
                type: 'writer'
            };

            this.io.emit( "removeShmdata", quiddityId, shmdata );
        }

        //Shmdata Reader
        if ( value[0].indexOf( ".shmdata.reader" ) >= 0 ) { //writer
            var shmdata = {
                path: value[0].replace( ".shmdata.reader.", "" ),
                type: 'reader'
            };

            this.io.emit( "removeShmdata", quiddityId, shmdata );
        }

        if ( quiddityId == this.config.sip.quiddName ) {
            var idUser   = value[0].split( "." )[2];
            var infoUser = JSON.parse( switcher.get_info( quiddityId, '.buddy.' + idUser ) );
            this.io.emit( 'infoUser', infoUser );
        }
    }


    /* manage callback fro systemusage quidd  */

    if ( quiddityId == "systemusage" && signal == "on-tree-grafted" ) {
        var info = switcher.get_info( quiddityId, value[0] );
        // log.debug("systemusage info", switcher.get_info(qname, pvalue[0]));
        this.io.emit( "systemusage", info );
    }


    /* ************ SIGNAL - ON QUIDDITY CREATED ************ */

    if ( signal == "on-quiddity-created" ) {

        var quiddClass = JSON.parse( switcher.get_quiddity_description( value[0] ) );
        if ( !_.contains( this.config.quiddExclude, quiddClass.class ) ) {

            /* subscribe signal for properties add/remove and methods add/remove */
            switcher.subscribe_to_signal( value[0], "on-property-added" );
            switcher.subscribe_to_signal( value[0], "on-property-removed" );
            switcher.subscribe_to_signal( value[0], "on-method-added" );
            switcher.subscribe_to_signal( value[0], "on-method-removed" );
            switcher.subscribe_to_signal( value[0], "on-connection-tried" );

            /*subscribe to the modification on this quiddity systemusage*/
            switcher.subscribe_to_signal( value[0], "on-tree-grafted" );
            switcher.subscribe_to_signal( value[0], "on-tree-pruned" );

            /* we subscribe all properties of quidd created */
            try {
                var propDecription = switcher.get_properties_description( value[0] );
                var properties     = JSON.parse( switcher.get_properties_description( value[0] ) ).properties;
                _.each( properties, function ( property ) {
                    switcher.subscribe_to_property( value[0], property.name );
                    log.debug( "Subscribed to", value[0], property.name );
                } );
            } catch ( e ) {
                log.error( "Error getting properties", e );
            }

            // Broadcast creation message including the creator's socketId so that the interface can know if they created the quiddity
            this.io.emit( "create", quiddClass, this.quiddityManager.quidditySocketMap[quiddClass.name] );

            //FIXME: socket.io removed except in 1.0
            /*var socketIdCreatedThisQuidd = false;
            /!*_.each(this.config.listQuiddsAndSocketId, function(socketId, quiddName) {
             if (quiddName == pvalue[0])
             socketIdCreatedThisQuidd = socketId;
             delete this.config.listQuiddsAndSocketId[quiddName];
             });*!/
            if ( socketIdCreatedThisQuidd ) {
                console.log( this.io.sockets.clients() );
                this.io.except( socketIdCreatedThisQuidd ).emit( "create", quiddClass );
            } else {
            }*/
        }
    }

    /* ************ SIGNAL - ON QUIDDITY REMOVED ************ */

    /* Emits to users a quiddity is removed */
    if ( signal == "on-quiddity-removed" ) {

        this.io.emit( "remove", value );
        log.debug( "the quiddity " + value + " is removed" );
        this.quiddityManager.removeElementsAssociateToQuiddRemoved( value[0] );
    }

    if ( signal == "on-property-added" || signal == "on-property-removed" || signal == "on-method-added" || signal == "on-method-removed" ) {
        //TODO: redo subscriptions
        log.debug( "TODO: SUBSCRIPTIONS!", this.config.subscribe_quidd_info );
        /*_.each( this.config.subscribe_quidd_info, function ( quiddName, socketId ) {
            if ( quiddName == qname ) {
                log.debug( "Sending to socket", socketId, qsignal, pvalue );
                var socket = self.io.sockets.sockets[socketId];
                if ( socket ) {
                    socket.emit( 'signals_properties_info', qsignal, qname, pvalue );
                }
            }
        } );*/
    }

    /* ************ SIGNAL - ON PROPERTY ADDED ************ */

    /* subscribe to the property added */
    if ( signal == "on-property-added" ) {
        log.debug( "Subscribing to property", quiddityId, value[0] );
        switcher.subscribe_to_property( quiddityId, value[0] );
    }

    /* ************ SIGNAL - ON PROPERTY REMOVED ************ */

    if ( signal == "on-property-removed" ) {
        log.debug( "Unsubscribing from property", quiddityId, value[0] );
        switcher.unsubscribe_to_property( quiddityId, value[0] );
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