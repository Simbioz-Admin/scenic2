"use strict";

var _       = require( 'underscore' );
var i18n    = require( 'i18next' );
var slug    = require( 'slug' );
var log     = require( '../lib/logger' );
var logback = require( './logback' );

/**
 * Constructor
 *
 * @param config
 * @param switcher
 * @param io
 * @constructor
 */
function ReceiverManager( config, switcher, io ) {
    this.config   = config;
    this.switcher = switcher;
    this.io       = io;
}

/**
 * Initialize
 */
ReceiverManager.prototype.initialize = function () {

};

/**
 * Binds a new client socket
 *
 * @param socket
 */
ReceiverManager.prototype.bindClient = function ( socket ) {
    //socket.on( "listRTPDestinations", this.listRTPDestinations.bind( this ) );
    socket.on( "createRTPDestination", this.createRTPDestination.bind( this ) );
    socket.on( "removeRTPDestination", this.removeRTPDestination.bind( this ) );
    socket.on( "connectRTPDestination", this.connectRTPDestination.bind( this ) );
    //
    //
    //
    socket.on( "update_destination", this.update_destination.bind( this ) );
    socket.on( "remove_connection", this.remove_connection.bind( this ) );
};

//   ██████╗ █████╗ ██╗     ██╗     ██████╗  █████╗  ██████╗██╗  ██╗███████╗
//  ██╔════╝██╔══██╗██║     ██║     ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝
//  ██║     ███████║██║     ██║     ██████╔╝███████║██║     █████╔╝ ███████╗
//  ██║     ██╔══██║██║     ██║     ██╔══██╗██╔══██║██║     ██╔═██╗ ╚════██║
//  ╚██████╗██║  ██║███████╗███████╗██████╔╝██║  ██║╚██████╗██║  ██╗███████║
//   ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝

/**
 * List RTP Destinations
 *
 * @deprecated
 * @param cb
 * @returns {*}
 */
/*ReceiverManager.prototype.listRTPDestinations = function ( cb ) {
 try {
 var destinations = this.switcher.invoke( 'dico', 'read', ['rtpDestinations'] );
 } catch ( e ) {
 return logback( e, cb );
 }
 if ( !destinations ) {
 return logback( i18n.t( 'Could not list RTP destinations' ), cb );
 }
 cb( null, destinations );
 };*/

/**
 * Create a new RTP destination
 * Adds the destination in rtpsession and if a soap port was
 * defined we create a SOAPControlClient quiddity to create an httpsdpdec on the remote server
 *
 * @param info
 * @param cb
 **/
ReceiverManager.prototype.createRTPDestination = function ( info, cb ) {
    log.debug( 'Creating RTP destination', info );

    // Validate
    if ( !info || !info.name || !info.host ) {
        return logback( i18n.t( 'Missing information to create an RTP destination' ), cb );
    } else if ( info.port && !_.isNumber( info.port ) ) {
        return logback( i18n.t( 'Invalid port' ), cb );
    }

    // Sanity check
    info.id   = /*slug(*/ info.name /*)*/;
    info.host = info.host.replace( 'http://', '' );

    // Load current destinations
    try {
        var result = JSON.parse( this.switcher.get_property_value( this.config.rtp.quiddName, 'destinations-json' ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !result || result.error ) {
        return logback( result ? result.error : i18n.t( 'Could not load RTP destinations.' ), cb );
    }

    var destinations = result.destinations;

    // Check if the name is already taken
    var nameExists = _.findWhere( destinations, {name: info.name} );
    if ( nameExists ) {
        return logback( i18n.t( 'RTP destination name (__rtpDestinationName__) already exists', {rtpDestinationName: info.name} ), cb );
    }

    // Add to the default RTP quiddity
    var added = this.switcher.invoke( this.config.rtp.quiddName, 'add_destination', [info.name, info.host] );
    if ( !added ) {
        return logback( i18n.t( 'Failed to add destination (__rtpDestinationName__) to the RTP session quiddity', {rtpDestinationName: info.name} ), cb );
    }

    // If we have a port, we create the SOAP quiddity
    if ( info.port ) {
        log.debug( 'SOAP port ' + info.port + ' provided, creating quiddity...' );

        // Create the quiddity
        var createdSOAPClient = this.switcher.create( 'SOAPcontrolClient', this.config.soap.controlClientPrefix + info.name );
        if ( !createdSOAPClient ) {
            return logback( i18n.t( 'Could not create SOAP client __soapClient__', {soapClient: info.name} ), cb );
        }

        // Assign the URL
        var urlSet = this.switcher.invoke( this.config.soap.controlClientPrefix + info.name, 'set_remote_url_retry', ['http://' + info.host + ':' + info.port] );
        if ( !urlSet ) {
            //TODO: Should probably remove the quiddity at this point
            return logback( i18n.t( 'Failed to set the remote URL on SOAP client __soapClient__', {soapClient: info.name} ), cb );
        }

        // Attempt to http spd dec on remote machine
        var httpSdpDecCreated = this.switcher.invoke( this.config.soap.controlClientPrefix + info.name, 'create', ['httpsdpdec', this.config.nameComputer] );
        if ( !httpSdpDecCreated ) {
            log.warn( 'Could not create httpSdpDec' );
        }
    }

    cb();
};

/**
 * Remove an RTP destination
 *
 * @param id {string} rtp destination quiddity id
 * @param cb {object} callback
 */
ReceiverManager.prototype.removeRTPDestination = function ( id, cb ) {
    log.debug( 'Removing RTP destination', id );

    // Remove the destination
    var removed = this.switcher.invoke( this.config.rtp.quiddName, 'remove_destination', [id] );
    if ( !removed ) {
        return logback( i18n.t( 'Failed to remove RTP destination __destination__', {destination: id} ), cb );
    }

    // Remove SOAP Client
    var soapClientRemoved = this.switcher.invoke( this.config.soap.controlClientPrefix + id, 'remove', [this.config.nameComputer] );
    if ( !soapClientRemoved ) {
        log.warn( 'SOAP client removal failed for __client__', {client: id} );
    }

    // Remove SOAP Control Client
    var soapControlClientRemoved = this.switcher.remove( this.config.soap.controlClientPrefix + id );
    if ( !soapControlClientRemoved ) {
        log.warn( 'SOAP control client removal failed for __client__', {client: id} );
    }

    cb();
};


/**
 *  Action to send a shmdata to a specific receiver. Checking presence of shmdata
 * in data_stream that will be added if missing. Update the shmdata associate with a receiver in the dico Destinations
 *
 * @param path {String} path of shmdata
 * @param id {String} id of receiver
 * @param port {int} Port which is sent shmata
 * @param callback {object} return true if success or send message error
 */
ReceiverManager.prototype.connectRTPDestination = function ( path, id, port, cb ) {
    log.debug( "Connecting quiddity to RTP destination", path, id, port, soapPort );

    // Check if the connection has already been made
    var rtpShmdata = JSON.parse( this.switcher.get_info( this.config.rtp.quiddName, '.shmdata' ) );
    if ( rtpShmdata && rtpShmdata.reader && _.contains( _.keys( rtpShmdata.reader ), path ) ) {
        return logback( i18n.t( 'Already connected' ), cb );
    }

    // Make the connection
    var dataStreamAdded = this.switcher.invoke( this.config.rtp.quiddName, 'add_data_stream', [path] );
    if ( !dataStreamAdded ) {
        return logback( i18n.t( 'Error adding data stream to destination __path__', {path: path} ), cb );
    }

    // Associate the stream with a destination on rtp
    var udpAdded = this.switcher.invoke( this.config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, port] );
    if ( !udpAdded ) {
        //TODO: Cancel connection
        return logback( i18n.t( 'Error udp stream to destination __path__ __id__ __port__', {
            path: path,
            id:   id,
            port: port
        } ), cb );
    }

    // If a soap port was defined we set the shmdata to the httpsdpdec
    //TODO: We need a way to retrieve the set SOAP port
    /*var soapControlClient = this.switcher.get_properties_description( this.config.soap.controlClientPrefix + id );
     if ( soapPort != null && soapPort != '' ) {
     this.refresh_httpsdpdec( id, function ( error ) {
     if ( error ) {
     return log.warn( 'Could not refresh httpsdpdec.', error );
     }
     } );
     }*/

    //this.io.emit( 'add_connection', quiddityId, path, port, id );
    return cb();
};

//  ██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗
//  ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝
//  ██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝
//  ██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝
//  ███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║
//  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝
//


/**
 *  Remove a receiver. Remove to dico destinations and check if nobody is
 connected to the shmdata for remove to data stream of rtpsession

 @param path {String} path of shmdata
 @param id {String} id of receiver
 @param callback {object} if sucess return name true
 */
ReceiverManager.prototype.remove_connection = function ( path, id, cb ) {
    var self = this;

    /* 1. remove the association between shmdata and destination */
    var remove = this.switcher.invoke( "defaultrtp", "remove_udp_stream_to_dest", [path, id] );
    if ( !remove ) {
        return cb( i18n.t( "Error to remove udp stream to destination" ) );
    }

    /* 2. we remove data stream to the dico destination */
    var destinations_rtp  = JSON.parse( this.switcher.get_property_value( "defaultrtp", "destinations-json" ) ).destinations;
    var destinations_dico = JSON.parse( this.switcher.invoke( "dico", "read", ["rtpDestinations"] ) );

    /* 3. remove connection from dico destinations */
    var connectWithAnother = false;
    _.each( destinations_dico, function ( dest, i ) {
        /* only fir receiver who disconnect */
        if ( dest.id == id ) {
            var newStreamsList = _.reject( dest.data_streams, function ( stream ) {
                return stream.path == path;
            } );
            if ( dest.portSoap ) {
                this.refresh_httpsdpdec( dest.id, function ( err ) {
                    if ( err ) {
                        return log.error( "error on refresh httpsdpdec" );
                    }
                } );
            }

            destinations_dico[i].data_streams = newStreamsList;
        } else {
            /* check if another destination is connected to this shmdata */
            var dataStreamUse = _.where( dest.data_streams, {
                path: path
            } );
            if ( dataStreamUse.length > 0 ) {
                connectWithAnother = true;
            }
        }
    }, this );

    /* if nobody is connected to the shm we removed of rtpsession */
    if ( !connectWithAnother ) {
        log.debug( "remove shmdata of data_stream", path );
        var removeData = this.switcher.invoke( "defaultrtp", "remove_data_stream", [path] );
        if ( !removeData ) {
            return log.error( "failed to remove data_stream", path );
        }
    } else {
        log.debug( "Another receiver is connected to", path );
    }

    var setPropertyValueOfDico = this.switcher.invoke( "dico", "update", ["rtpDestinations", JSON.stringify( destinations_dico )] );
    if ( !setPropertyValueOfDico ) {
        return cb( "error when saving Destinations Dico" );
    }


    this.io.emit( "remove_connection", path, id );
    //var url = 'http://' + this.config.host + ':' + this.config.soap.port + '/sdp?rtpsession=defaultrtp&destination=' + id;
    //var updateShm = this.switcher.invoke("soapControlClient-" + id, "invoke1", [this.config.nameComputer, 'to_shmdata', url]);
    if ( cb ) {
        return cb( null, remove );
    }
};

/**
 *  Update destination. Currently remove the destination and create a new with the modification

 @param path {String} path of shmdata
 @param oldId {String} id of  old receiver
 @param destination {json} Contain all information for create a new destination
 @param callback {object} if sucess return name message success {json}
 */
ReceiverManager.prototype.update_destination = function ( oldId, destination, cb ) {

    var self = this;

    var destinations = JSON.parse( this.switcher.invoke( "dico", "read", ["rtpDestinations"] ) ),
        data_streams = destination.data_streams;

    /* 1. we remove destination */

    this.remove_destination( oldId, destination.portSoap, function ( data ) {
        if ( data.error ) {
            return log.error( data.error );
        }

        /* 2. recreate destination*/

        self.createRtpDestination( destination, function ( data ) {
            if ( data.error ) {
                return log.error( data.error );
            }

            /* 3. Recreate the connection */
            /* SetTimeout is necessary for waiting recrate destination in client side for recreate connection after */
            setTimeout( function () {
                if ( _.size( data_streams ) > 0 ) {
                    _.each( data_streams, function ( stream ) {

                        /* 1. associate the stream with a destination on defaultrtp */

                        this.connect_destination( data.destination.id, stream.path, data.destination.id, stream.port, data.destination.portSoap, function ( ok ) {
                            if ( !ok ) {
                                cb( {
                                    "error": "failed to reconnect destination"
                                } );
                            }
                        } )

                    }, self );
                } else {
                    return cb( {
                        "success": "Success update destination"
                    } );
                }
            }, 500 );
        } );

    } );

};


/**
 *  Refresh httpsdpdec of the remote receiver
 *  @param id {string} Id of receiver
 *  @param callback {object} return an error if exist
 */
ReceiverManager.prototype.refresh_httpsdpdec = function ( id, cb ) {

    /* need wait 1sec for update url rtp to the ControlClient */
    setTimeout( function () {
        var url       = 'http://' + this.config.host + ':' + this.config.soap.port + '/sdp?rtpsession=defaultrtp&destination=' + id;
        log.debug( "refresh httpsdpdec of", url );
        var updateShm = this.switcher.invoke( "soapControlClient-" + id, "invoke1", [this.config.nameComputer, 'to_shmdata', url] );
        if ( !updateShm ) {
            return cb( "error updateShm" );
        }
    }, 2000 );
};

module.exports = ReceiverManager;