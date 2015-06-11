"use strict";

var _       = require( 'underscore' );
var i18n    = require( 'i18next' );
var async   = require( 'async' );
var log     = require( '../lib/logger' );
var logback = require( '../utils/logback' );

/**
 * Constructor
 *
 * @param config
 * @param switcher
 * @param io
 * @constructor
 */
function RtpManager( config, switcher, io ) {
    this.config   = config;
    this.switcher = switcher;
    this.io       = io;
}

/**
 * Initialize
 */
RtpManager.prototype.initialize = function () {

};

/**
 * Binds a new client socket
 *
 * @param socket
 */
RtpManager.prototype.bindClient = function ( socket ) {
    socket.on( "createRTPDestination", this.createRTPDestination.bind( this ) );
    socket.on( "removeRTPDestination", this.removeRTPDestination.bind( this ) );
    socket.on( "connectRTPDestination", this.connectRTPDestination.bind( this ) );
    socket.on( "disconnectRTPDestination", this.disconnectRTPDestination.bind( this ) );
    socket.on( "updateRTPDestination", this.updateRTPDestination.bind( this ) );
};

/**
 * Switcher Property Callback
 *
 * @param quiddityId
 * @param property
 * @param value
 */
RtpManager.prototype.onSwitcherProperty = function ( quiddityId, property, value ) {

};

/**
 * Switcher Signal Callback
 *
 * @param quiddityId
 * @param signal
 * @param value
 */
RtpManager.prototype.onSwitcherSignal = function ( quiddityId, signal, value ) {

    //  ┌─┐┌─┐┌┐┌┌┐┌┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌┬┐┬─┐┬┌─┐┌┬┐
    //  │  │ │││││││├┤ │   │ ││ ││││   │ ├┬┘│├┤  ││
    //  └─┘└─┘┘└┘┘└┘└─┘└─┘ ┴ ┴└─┘┘└┘   ┴ ┴└─┴└─┘─┴┘

    if ( signal == 'on-connection-tried' ) {
        //TODO: Do something with that
        log.warn( '>>>', signal, quiddityId, value, '<<<' );
        this.io.emit( 'rtpConnectionTried', quiddityId, signal, value[0] );
    }

};

/**
 * Refresh httpSdpDec of the remote receiver
 *
 * @param id {string} Id of receiver
 * @param cb {object} return an error if exist
 */
RtpManager.prototype._refreshHttpSdpDec = function ( id, cb ) {
    var self = this;
    setTimeout( function () {
        var url       = 'http://' + self.config.host + ':' + self.config.soap.port + '/sdp?rtpsession=' + self.config.rtp.quiddName + '&destination=' + id;
        log.debug( 'Refreshing httpSdpDec', url );
        var refreshed = self.switcher.invoke( self.config.soap.controlClientPrefix + id, 'invoke1', [self.config.nameComputer, 'to_shmdata', url] );
        if ( !refreshed ) {
            return cb( 'Error refreshing httpSdpDec' );
        }
    }, 2000 );
};

//   ██████╗ █████╗ ██╗     ██╗     ██████╗  █████╗  ██████╗██╗  ██╗███████╗
//  ██╔════╝██╔══██╗██║     ██║     ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝
//  ██║     ███████║██║     ██║     ██████╔╝███████║██║     █████╔╝ ███████╗
//  ██║     ██╔══██║██║     ██║     ██╔══██╗██╔══██║██║     ██╔═██╗ ╚════██║
//  ╚██████╗██║  ██║███████╗███████╗██████╔╝██║  ██║╚██████╗██║  ██╗███████║
//   ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝

/**
 * Create a new RTP destination
 * Adds the destination in rtpsession and if a soap port was
 * defined we create a SOAPControlClient quiddity to create an httpsdpdec on the remote server
 *
 * @param name
 * @param host
 * @param port
 * @param cb
 **/
RtpManager.prototype.createRTPDestination = function ( name, host, port, cb ) {
    log.info( 'Creating RTP destination', name, host, port );

    // Validate
    if ( !name || !host ) {
        return logback( i18n.t( 'Missing information to create an RTP destination' ), cb );
    } else if ( port && isNaN( parseInt( port ) ) ) {
        return logback( i18n.t( 'Invalid port __port__', {port: port} ), cb );
    }

    // Sanity check
    //TODO: Parse URL for real
    host = host.replace( 'http://', '' );

    // Load current destinations
    try {
        var result = this.switcher.get_property_value( this.config.rtp.quiddName, 'destinations-json' );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !result || result.error ) {
        return logback( i18n.t( 'Could not load RTP destinations.' ) + ( result && result.error ? ' ' + result.error : '' ), cb );
    }

    if ( result.destinations && _.isArray( result.destinations ) ) {
        var destinations = result.destinations;

        // Check if the name is already taken
        var nameExists = _.findWhere( destinations, {name: name} );
        if ( nameExists ) {
            return logback( i18n.t( 'RTP destination name (__rtpDestinationName__) already exists', {rtpDestinationName: name} ), cb );
        }
    }

    // Add to the default RTP quiddity
    try {
        var added = this.switcher.invoke( this.config.rtp.quiddName, 'add_destination', [name, host] );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !added ) {
        return logback( i18n.t( 'Failed to add destination (__rtpDestinationName__) to the RTP session quiddity', {rtpDestinationName: name} ), cb );
    }

    // If we have a port, we create the SOAP quiddity
    if ( port ) {
        log.debug( 'SOAP port ' + port + ' provided, creating quiddity...' );

        // Create the quiddity
        try {
            var createdSOAPClient = this.switcher.create( 'SOAPcontrolClient', this.config.soap.controlClientPrefix + name );
        } catch ( e ) {
            return logback( e.toString(), cb );
        }
        if ( !createdSOAPClient ) {
            return logback( i18n.t( 'Could not create SOAP client __soapClient__', {soapClient: name} ), cb );
        }

        // Assign the URL
        try {
            var urlSet = this.switcher.invoke( this.config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
        } catch ( e ) {
            return logback( e.toString(), cb );
        }
        if ( !urlSet ) {
            //TODO: Should probably remove the quiddity at this point
            return logback( i18n.t( 'Failed to set the remote URL on SOAP client __soapClient__', {soapClient: name} ), cb );
        }

        // Attempt to create httpsdpdec on remote machine
        try {
            var httpSdpDecCreated = this.switcher.invoke( this.config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', this.config.nameComputer] );
        } catch ( e ) {
            return logback( e.toString(), cb );
        }
        if ( !httpSdpDecCreated ) {
            return logback( i18n.t( 'Could not create httpSdpDec' ), cb );
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
RtpManager.prototype.removeRTPDestination = function ( id, cb ) {
    log.info( 'Removing RTP destination', id );

    // Remove the destination
    try {
        var removed = this.switcher.invoke( this.config.rtp.quiddName, 'remove_destination', [id] );
    } catch ( e ) {
        //TODO: Probably continue removing when it fails
        return logback( e.toString(), cb );
    }
    if ( !removed ) {
        //TODO: Probably continue removing when it fails
        return logback( i18n.t( 'Failed to remove RTP destination __destination__', {destination: id} ), cb );
    }

    // Remove Remote httpsdpdec
    try {
        var soapClientRemoved = this.switcher.invoke( this.config.soap.controlClientPrefix + id, 'remove', [this.config.nameComputer] );
    } catch ( e ) {
        //TODO: Probably continue removing when it fails
        return logback( e.toString(), cb );
    }
    if ( !soapClientRemoved ) {
        log.warn( 'SOAP client removal failed for __client__', {client: id} );
    }

    // Remove SOAP Control Client
    try {
        var soapControlClientRemoved = this.switcher.remove( this.config.soap.controlClientPrefix + id );
    } catch ( e ) {
        //TODO: Probably continue removing when it fails
        return logback( e.toString(), cb );
    }
    if ( !soapControlClientRemoved ) {
        log.warn( 'SOAP control client removal failed for __client__', {client: id} );
    }

    //TODO: As in remove connection, remove any orphan shmdata from rtp quiddity (TEST THIS)

    cb();
};

/**
 *  Action to send a shmdata to a specific receiver. Checking presence of shmdata
 * in data_stream that will be added if missing. Update the shmdata associate with a receiver in the dico Destinations
 *
 * @param path {String} path of shmdata
 * @param id {String} id of receiver
 * @param port {int} Port which is sent shmata
 * @param cb
 */
RtpManager.prototype.connectRTPDestination = function ( path, id, port, cb ) {
    log.info( "Connecting quiddity to RTP destination", path, id, port );

    if ( _.isEmpty( path ) ) {
        return logback( i18n.t( 'Missing path' ), cb );
    }

    if ( _.isEmpty( id ) ) {
        return logback( i18n.t( 'Missing destination' ), cb );
    }

    if ( isNaN( parseInt( port ) ) ) {
        return logback( i18n.t( 'Missing or invalid port' ), cb );
    }

    // Check if the connection has already been made
    try {
        var rtpShmdata = this.switcher.get_info( this.config.rtp.quiddName, '.shmdata.reader' );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    var alreadyHasShmdata = false;
    if ( rtpShmdata && _.contains( _.keys( rtpShmdata ), path ) ) {
        log.debug( 'RTP is already connected to shmdata', path );
        log.verbose( rtpShmdata );
        alreadyHasShmdata = true;
    }

    if ( !alreadyHasShmdata ) {
        // Make the connection
        try {
            var dataStreamAdded = this.switcher.invoke( this.config.rtp.quiddName, 'add_data_stream', [path] );
        } catch ( e ) {
            return logback( e.toString(), cb );
        }
        if ( !dataStreamAdded ) {
            return logback( i18n.t( 'Error adding data stream to destination __path__', {path: path} ), cb );
        }
    }

    // Associate the stream with a destination on rtp
    try {
        var udpAdded = this.switcher.invoke( this.config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, port] );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !udpAdded ) {
        //TODO: Cancel connection
        return logback( i18n.t( 'Error adding udp stream to destination __path__ __id__ __port__', {
            path: path,
            id:   id,
            port: port
        } ), cb );
    }

    // If a soap port was defined we set the shmdata to the httpsdpdec
    try {
        var hasSoapControlClient = this.switcher.has_quiddity( this.config.soap.controlClientPrefix + id );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( hasSoapControlClient ) {
        this._refreshHttpSdpDec( id, function ( error ) {
            if ( error ) {
                log.warn( error );
            }
        } );
    }

    return cb();
};

/**
 * Disconnect an RTP destination
 *
 * @param path {String} path of shmdata
 * @param id {String} id of receiver
 * @param cb
 */
RtpManager.prototype.disconnectRTPDestination = function ( path, id, cb ) {
    log.info('Disconnecting RTP destination', path, id);

    // Remove UDP Stream
    try {
        var udpRemoved = this.switcher.invoke( this.config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !udpRemoved ) {
        return logback( i18n.t( 'Error removing UDP stream from destination' ), cb );
    }

    // Check if the shmdata is still used by another connection
    try {
        var result = this.switcher.get_property_value( this.config.rtp.quiddName, 'destinations-json' );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    var stillUsed = false;
    if ( result && result.destinations && _.isArray( result.destinations ) ) {
        var destinations = result.destinations;
        stillUsed        = _.some( destinations, function ( destination ) {
            return _.some( destination.data_streams, function ( dataStream ) {
                return dataStream.path == path;
            } );
        } );
    }

    // If not, then remove the shmdata from the destination
    if ( !stillUsed ) {
        log.debug( 'Last one using shmdata', path );
        try {
            var removed = this.switcher.invoke( this.config.rtp.quiddName, 'remove_data_stream', [path] );
        } catch ( e ) {
            return logback( e.toString(), cb );
        }
        if ( !removed ) {
            return logback( i18n.t( 'Failed to remove data stream __path__', {path: path} ), cb );
        }
    } else {
        log.debug( 'Not removing shmdata', path, 'it is still being used' );
    }

    // If a soap port was defined refresh the httpsdpdec
    try {
        var hasSoapControlClient = this.switcher.has_quiddity( this.config.soap.controlClientPrefix + id );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( hasSoapControlClient ) {
        this._refreshHttpSdpDec( id, function ( error ) {
            if ( error ) {
                log.warn( error );
            }
        } );
    }

    cb();
};

/**
 * Update RTP destination.
 * Currently removes the destination and creates a new one.
 *
 * TODO: This could benefit for being more granular and react according to what has changed (name, host, port)
 *
 * @param id
 * @param info
 * @param cb
 */
RtpManager.prototype.updateRTPDestination = function ( id, info, cb ) {
    log.info( 'Updating RTP destination', id, info );

    var self = this;

    // Keep a cache of the current destination
    try {
        var result = this.switcher.get_property_value( this.config.rtp.quiddName, 'destinations-json' );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    var destination = null;
    if ( result && result.destinations && _.isArray( result.destinations ) ) {
        destination = _.findWhere( result.destinations, {name: id} );
    }

    async.series( [
        function ( callback ) {
            self.removeRTPDestination( id, callback );
        },
        function ( callback ) {
            self.createRTPDestination( info.name, info.host, info.port, callback );
        },
        function ( callback ) {
            if ( destination ) {
                // According to the old code a setTimeout of 200ms could be necessary here
                async.each( destination.data_streams, function ( stream, callback ) {
                    self.connectRTPDestination( stream.path, info.name, stream.port, callback )
                }, function ( error ) {
                    if ( error ) {
                        return callback( error );
                    }
                    callback();
                } );
            } else {
                callback();
            }
        }
    ], function ( error ) {
        if ( error ) {
            return logback( error, cb );
        }
        cb();
    } );
};

module.exports = RtpManager;