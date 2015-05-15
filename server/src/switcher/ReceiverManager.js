"use strict";

var _    = require( 'underscore' );
var i18n = require( 'i18next' );
var log  = require( '../lib/logger' );

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
 * Binds a new client socket
 *
 * @param socket
 */
ReceiverManager.prototype.bindClient = function ( socket ) {
    socket.on( "list_rtp_destinations", this.list_rtp_destinations.bind( this ) );
    socket.on( "create_destination", this.create_destination.bind( this ) );
    socket.on( "update_destination", this.update_destination.bind( this ) );
    socket.on( "remove_destination", this.remove_destination.bind( this ) );
    socket.on( "connect_destination", this.connect_destination.bind( this ) );
    socket.on( "remove_connection", this.remove_connection.bind( this ) );
};

/**
 * List RTP Destinations
 *
 * @param cb
 * @returns {*}
 */
ReceiverManager.prototype.list_rtp_destinations = function( cb ) {
    var destinations = this.switcher.invoke( 'dico', 'read', ['rtpDestinations'] );
    if ( !destinations ) {
        var msg = "Could not list RTP destinations.";
        log.error(msg);
        return cb(msg);
    }
    cb(null,destinations);
};

//
//
//

/**
 *  Create a new Receiver : Add in dico destination, add destination in rtpsession and if a port soap is
 *  define we create  a quidd SOAPControlClient for create an httpsdpdec on the distance server
 *
 *  @param {string} destination name of the new destination
 *  @param {object} callback return informatin about the new destination and a message
 *  or an error message
 **/
ReceiverManager.prototype.create_destination = function ( destination, cb ) {

    /* Get the destinations existing stock in dico (propety destinations) */
    var destinations = this.switcher.invoke( "dico", "read", ["rtpDestinations"] );
    destinations     = JSON.parse( destinations );

    var exist = _.findWhere( destinations, {
        name: destination.name
    } );

    /* check if already in the collection */
    if ( exist ) {
        return cb( {
            error: "the destination already exists"
        } );
        log.warn( "destination with the name " + destination.hostName + "already exists" );
    }

    /* define a id before create client side */
    destination["id"]           = destination.name;
    destination['data_streams'] = [];
    destination.hostName        = destination.hostName.replace( "http://", "" );


    destinations.push( destination );

    // var setDestination = this.switcher.set_property_value("dico", "rtpDestinations", JSON.stringify(destinations));
    var setDestination  = this.switcher.invoke( "dico", "update", ["rtpDestinations", JSON.stringify( destinations )] );
    if ( !setDestination ) {
        var msg = "Failed to set property destination for add " + destination.hostName;
        log.error( msg );
        return cb( {
            error: msg
        } );
    }

    /* add the destination to the quiddity rtpsession */

    log.info( "add to rtpdefault", destination.id );
    var addToRtpSession = this.switcher.invoke( "defaultrtp", "add_destination", [destination.id, destination.hostName] );

    if ( !addToRtpSession ) {
        var msg = i18n.t( "Failed to add the destination to the quidd RTPSession" );
        log.error( msg );
        return cb( {
            error: msg
        } );
    }

    /* if port SOAP define we create a quiddity for communiate with the other scenic machine */

    if ( destination.portSoap ) {
        log.info( "Soap Define, we create quiddity for " );


        /* 1. we create a SOAPControlClient for talk to te other scenic */

        if ( destination.hostName.indexOf( "http://" ) < 0 ) {
            destination.hostName = "http://" + destination.hostName;
        }

        var addressClient    = destination.hostName + ":" + destination.portSoap,
            createSoapClient = this.switcher.create( "SOAPcontrolClient", "soapControlClient-" + destination.id );

        if ( !createSoapClient ) {
            var msg = i18n.t( "Failed to create Quiddity " ) + destination.id;
            log.error( msg );
            return cb( {
                error: msg
            } );
        }

        /* 2. we set url of client on quidd SOAPControlClient */

        var setUrl = this.switcher.invoke( "soapControlClient-" + destination.id, "set_remote_url_retry", [addressClient] );
        if ( !setUrl ) {
            var msg = i18n.t( "Failed to set the method set_remote_url_retry for " ) + destination.id;
            log.error( msg );
            return cb( {
                error: msg
            } );
        }

        /* 3. we try to create soapClient on the client scenic */

        var CreateHttpsdpdec = this.switcher.invoke( "soapControlClient-" + destination.id, "create", ["httpsdpdec", this.config.nameComputer] );
        log.info( "Quidds httpsdpdec created?", CreateHttpsdpdec );

    }

    /* callback success create destination */
    cb( {
        destination: destination,
        success:     "The destination " + destination.name + " is added"
    } );
    /* Send all creation of destination */
    this.io.emit( "create_destination", destination );

};

/**
 *  Action to send a shmdata to a specific receiver. Checking presence of shmdata
 in data_stream that will be added if missing. Update the shmdata associate with a receiver in the dico Destinations

 @param quiddName {String} Name quiddity with the shmdata
 @param path {String} path of shmdata
 @param id {String} id of receiver
 @param port {int} Port which is sent shmata
 @param portSoap {int} Port soap remote server
 @param callback {object} return true if success or send message error
 */
ReceiverManager.prototype.connect_destination = function ( quiddName, path, id, port, portSoap, cb ) {

    log.info( "connect quiddity to receiver", quiddName, path, id, port, portSoap );

    /* 1. we need to check if the stream is already added to defaultrtp */
    var shmdataDefaultrtp = JSON.parse( this.switcher.get_info( "defaultrtp", ".shmdata.reader" ) );
    var pathAlreadyAdd    = _.keys( shmdataDefaultrtp );

    /* add data stream to dest */
    if ( !_.contains( pathAlreadyAdd, path ) ) {
        log.debug( "add path to datastream", path );
        var addDataStream = this.switcher.invoke( "defaultrtp", "add_data_stream", [path] );
        if ( !addDataStream ) {
            return log.error( "Error add data stream to dest", path );
        }

    } else {
        log.debug( "path already added", path );
    }

    /* 2. we associate the stream with a destination on defaultrtp */
    var addUdp = this.switcher.invoke( "defaultrtp", "add_udp_stream_to_dest", [path, id, port] );
    if ( !addUdp ) {
        return cb( "error add Udp" );
    }

    /* 3. we save data stream to the dico destination */
    var destinations = JSON.parse( this.switcher.invoke( "dico", "read", ["rtpDestinations"] ) );
    destinations     = _.map( destinations, function ( destination ) {

        if ( destination.id == id ) {
            destination.data_streams.push( {
                quiddName: quiddName,
                path:      path,
                port:      port
            } );
        }
        return destination;
    } );

    var setPropertyValueOfDico = this.switcher.invoke( "dico", "update", ["rtpDestinations", JSON.stringify( destinations )] );
    if ( !setPropertyValueOfDico ) {
        return cb( "error when saving Destinations Dico" );
    }


    /* 4. if a soap Port is define we set the shmdata to the httpsdpdec */

    if ( portSoap != "" ) {
        this.refresh_httpsdpdec( id, function ( err ) {
            if ( err ) {
                return log.error( "error on refresh httpsdpdec" );
            }
        } );
    }

    this.io.emit( "add_connection", quiddName, path, port, id );
    return cb( true );
};

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

        self.create_destination( destination, function ( data ) {
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
 *  Remove a receiver : Remove a receiver and all connection associate
 if Soap define, remove SOAPControlClient. Remove from dico destinations

 *  @param id {string} id of the destination
 *  @param portSoap {string} Port Soap
 *  @param callback {object} return error or success message
 **/
ReceiverManager.prototype.remove_destination = function ( id, portSoap, cb ) {

    var removeToRtp = this.switcher.invoke( "defaultrtp", "remove_destination", [id] );

    if ( !removeToRtp ) {
        var msg = i18n.t( "Failed to remove destination " ) + id;
        log.error( msg );
        return cb( {
            error: msg
        } );
    }

    /* Remove SoapClient to the destination with port SOAP */

    if ( portSoap != "" ) {
        var removeSoapClient    = this.switcher.invoke( "soapControlClient-" + id, "remove", [this.config.nameComputer] );
        var removeCOntrolCLient = this.switcher.remove( "soapControlClient-" + id );
    }


    /* remove destination of the dico */

    var destinations        = JSON.parse( this.switcher.invoke( "dico", "read", ["rtpDestinations"] ) );
    var destinationsWhitout = _.reject( destinations, function ( dest ) {
        return dest.id == id;
    } );
    var setDicoWithout      = this.switcher.invoke( "dico", "update", ["rtpDestinations", JSON.stringify( destinationsWhitout )] );
    if ( !setDicoWithout ) {
        var msg = i18n.t( "Failed to set destination " ),
            id;
        log.error( msg );
        return cb( {
            error: msg
        } );
    }

    cb( {
        sucess: i18n.t( "sucess remove destination" )
    } );
    /* Alert all destination has been removed */
    this.io.emit( "remove_destination", id );

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