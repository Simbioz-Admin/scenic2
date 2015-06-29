"use strict";

var _     = require( 'underscore' );
var i18n  = require( 'i18next' );
var async = require( 'async' );
var url   = require( 'url' );
var log   = require( '../lib/logger' );

var NameExistsError  = require( '../exceptions/NameExistsError' );
var InvalidHostError = require( '../exceptions/InvalidHostError' );
var InvalidPortError = require( '../exceptions/InvalidPortError' );

/**
 * Constructor
 *
 * @param switcherController
 * @constructor
 */
function RtpManager( switcherController ) {
    this.switcherController = switcherController;
    this.config             = this.switcherController.config;
    this.switcher           = this.switcherController.switcher;
    this.io                 = this.switcherController.io;
}

/**
 * Initialize
 */
RtpManager.prototype.initialize = function () {

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
 * @param {string} id Id of the RTP destination
 * @param {function} [cb] Callback
 */
RtpManager.prototype._refreshHttpSdpDec = function ( id, cb ) {
    var self = this;
    setTimeout( function () {
        var url       = 'http://' + self.config.host + ':' + self.config.soap.port + '/sdp?rtpsession=' + self.config.rtp.quiddName + '&destination=' + id;
        log.debug( 'Refreshing httpSdpDec', url );
        var refreshed = self.switcherController.quiddityManager.invokeMethod( self.config.soap.controlClientPrefix + id, 'invoke1', [self.config.nameComputer, 'to_shmdata', url] );
        if ( !refreshed ) {
            var error = 'Error refreshing httpSdpDec';
            log.warn( error );
            if ( cb ) {
                return cb( error );
            }
        } else if ( cb ) {
            return cb();
        }
    }, self.config.httpSdpDec.refreshTimeout );
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
 * @param {string} name - Destination name
 * @param {string} host - Hostname or ip address
 * @param {int} [port] - SOAP port of the destination
 * @throws InvalidHostError
 * @throws InvalidPortError
 * @throws NameExistsError
 * @returns {boolean} Success
 **/
RtpManager.prototype.createRTPDestination = function ( name, host, port ) {
    log.info( 'Creating RTP destination', name, host, port );

    if ( _.isEmpty( name ) || !_.isString( name ) ) {
        throw new Error( 'Missing or invalid name argument' );
    }

    if ( _.isEmpty( host ) || !_.isString( host ) ) {
        throw new Error( 'Missing or invalid host argument' );
    }

    // Adding double slashes at the beginning so that url.parse understands it
    var tmpHost = host;
    if ( tmpHost.indexOf( '//' ) == -1 ) {
        tmpHost = '//' + tmpHost;
    }
    var destination = url.parse( tmpHost, false, true );
    if ( !destination.hostname ) {
        log.warn( 'Invalid host', host );
        throw new InvalidHostError();
    }

    if ( port && isNaN( parseInt( port ) ) ) {
        log.warn( 'Invalid port', port );
        throw new InvalidPortError();
    }

    port = parseInt( port );

    var result = this.switcherController.quiddityManager.getPropertyValue( this.config.rtp.quiddName, 'destinations-json' );
    if ( result && result.destinations && _.isArray( result.destinations ) ) {
        var destinations = result.destinations;
        // Check if the name is already taken
        var nameExists = _.findWhere( destinations, { name: name } );
        if ( nameExists ) {
            log.warn( 'RTP destination name already exists', name );
            throw new NameExistsError();
        }
    }

    var added = this.switcherController.quiddityManager.invokeMethod( this.config.rtp.quiddName, 'add_destination', [name, destination.hostname] );
    if ( !added ) {
        log.warn( 'Could not add RTP destination', name, destination.hostname );
        return false;
    }

    // If we have a port, we create the SOAP quiddity
    if ( port ) {
        log.debug( 'SOAP port ' + port + ' provided, creating quiddity...' );

        // Create the quiddity
        var createdSOAPClient = this.switcher.create( 'SOAPcontrolClient', this.config.soap.controlClientPrefix + name );
        if ( !createdSOAPClient ) {
            log.warn( 'Could not create SOAP control client', this.config.soap.controlClientPrefix + name );
            return false;
        }

        // Assign the URL
        var soapURL = 'http://' + destination.hostname + ':' + port.toString();
        var urlSet  = this.switcherController.quiddityManager.invokeMethod( createdSOAPClient, 'set_remote_url_retry', [soapURL] );
        if ( !urlSet ) {
            //TODO: Should probably remove the quiddity at this point
            log.warn( 'Failed to set the remote URL on SOAP control client', soapURL );
            return false;
        }

        // Attempt to create httpsdpdec on remote machine
        var httpSdpDecCreated = this.switcherController.quiddityManager.invokeMethod( createdSOAPClient, 'create', ['httpsdpdec', this.config.nameComputer] );
        if ( !httpSdpDecCreated ) {
            log.warn( 'Could not create HTTP SDP Dec. on the remote client' );
            return false;
        }
    }

    return true;
};

/**
 * Remove an RTP destination
 *
 * @param id {string} rtp destination quiddity id
 * @returns {boolean} Success
 */
RtpManager.prototype.removeRTPDestination = function ( id ) {
    log.info( 'Removing RTP destination', id );

    // Remove the destination
    var removed = this.switcherController.quiddityManager.invokeMethod( this.config.rtp.quiddName, 'remove_destination', [id] );
    if ( !removed ) {
        log.warn( 'Failed to remove RTP destination', id );
    }

    // Remove Remote httpsdpdec
    var soapClientRemoved = this.switcherController.quiddityManager.invokeMethod( this.config.soap.controlClientPrefix + id, 'remove', [this.config.nameComputer] );
    if ( !soapClientRemoved ) {
        log.warn( 'SOAP client removal failed for client', id );
    }

    // Remove SOAP Control Client
    var soapControlClientRemoved = this.switcher.remove( this.config.soap.controlClientPrefix + id );
    if ( !soapControlClientRemoved ) {
        log.warn( 'SOAP control client removal failed for client', id );
    }

    //TODO: As in remove connection, remove any orphan shmdata from rtp quiddity (TEST THIS)

    return removed;
};

/**
 * Connect an RTP destination
 *
 * @param {String} id - id of the receiver
 * @param {string} path - Path of the shmdata
 * @param {int} port - Port to use
 * @returns {boolean} Success
 */
RtpManager.prototype.connectRTPDestination = function ( id, path, port ) {
    log.info( "Connecting quiddity to RTP destination", id, path, port );

    if ( _.isEmpty( id ) || !_.isString( id ) ) {
        throw new Error( 'Missing or invalid id argument' );
    }

    if ( _.isEmpty( path ) || !_.isString( path ) ) {
        throw new Error( 'Missing or invalid path argument' );
    }

    if ( !port || isNaN( parseInt( port ) ) ) {
        throw new Error( 'Missing or invalid port argument' );
    }

    port = parseInt( port );

    // Check if the connection has already been made
    var rtpShmdata        = this.switcherController.quiddityManager.getTreeInfo( this.config.rtp.quiddName, '.shmdata.reader' );
    var alreadyHasShmdata = false;
    if ( rtpShmdata && _.contains( _.keys( rtpShmdata ), path ) ) {
        log.debug( 'RTP is already connected to shmdata', path );
        log.verbose( rtpShmdata );
        alreadyHasShmdata = true;
    }

    if ( !alreadyHasShmdata ) {
        // Make the connection
        var dataStreamAdded = this.switcherController.quiddityManager.invokeMethod( this.config.rtp.quiddName, 'add_data_stream', [path] );
        if ( !dataStreamAdded ) {
            log.warn( 'Error adding data stream to destination', id, path );
            return false;
        }
    }

    // Associate the stream with a destination on rtp
    var udpAdded = this.switcherController.quiddityManager.invokeMethod( this.config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, String( port )] );
    if ( !udpAdded ) {
        log.warn( 'Error adding UDP stream to destination', id, path, port );
        this.disconnectRTPDestination( id, path );
        return false;
    }

    // If a soap port was defined we set the shmdata to the httpsdpdec
    var hasSoapControlClient = this.switcherController.quiddityManager.exists( this.config.soap.controlClientPrefix + id );
    if ( hasSoapControlClient ) {
        this._refreshHttpSdpDec( id );
    }

    return true;
};

/**
 * Disconnect an RTP destination
 *
 * @param {String} id - id of the destination
 * @param {String} path - path of the shmdata
 */
RtpManager.prototype.disconnectRTPDestination = function ( id, path ) {
    log.info( 'Disconnecting RTP destination', id, path );

    if ( _.isEmpty( id ) || !_.isString( id ) ) {
        throw new Error( 'Missing or invalid id argument' );
    }

    if ( _.isEmpty( path ) || !_.isString( path ) ) {
        throw new Error( 'Missing or invalid path argument' );
    }

    // Remove UDP Stream
    var udpRemoved = this.switcherController.quiddityManager.invokeMethod( this.config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
    if ( !udpRemoved ) {
        log.warn( 'Error removing UDP stream from destination' );
    }

    // Check if the shmdata is still used by another connection
    var result    = this.switcherController.quiddityManager.getPropertyValue( this.config.rtp.quiddName, 'destinations-json' );
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
        var dataStreamRemoved = this.switcherController.quiddityManager.invokeMethod( this.config.rtp.quiddName, 'remove_data_stream', [path] );
        if ( !dataStreamRemoved ) {
            log.warn( 'Failed to remove data stream', path );
        }
    } else {
        log.debug( 'Not removing shmdata', path, 'it is still being used' );
    }

    // If a soap port was defined refresh the httpsdpdec
    var hasSoapControlClient = this.switcherController.quiddityManager.exists( this.config.soap.controlClientPrefix + id );
    if ( hasSoapControlClient ) {
        this._refreshHttpSdpDec( id );
    }

    return udpRemoved;
};

/**
 * Update RTP destination.
 * Currently removes the destination and creates a new one.
 *
 * TODO: This could benefit for being more granular and react according to what has changed (name, host, port)
 *
 * @param {string} id - Destination Id
 * @param {Object} info - Attributes to change
 * @returns {boolean} Success
 */
RtpManager.prototype.updateRTPDestination = function ( id, info ) {
    log.info( 'Updating RTP destination', id, info );

    // Keep a cache of the current destination
    var result = this.switcherController.quiddityManager.getPropertyValue( this.config.rtp.quiddName, 'destinations-json' );
    var destination = null;
    if ( result && result.destinations && _.isArray( result.destinations ) ) {
        destination = _.findWhere( result.destinations, { name: id } );
    }

    var removed = this.removeRTPDestination( id );
    if ( !removed ) {
        log.warn('Could not remove RTP destination', id);
        return false;
    }

    var created = this.createRTPDestination( info.name, info.host, info.port );
    if ( !created ) {
        log.warn('Could not recreate RTP destination', info);
        return false;
    }

    if ( destination ) {
        var connectedAll = true;
        _.each( destination.data_streams, function ( stream ) {
            var connected = this.connectRTPDestination( stream.path, info.name, stream.port );
            if ( !connected ) {
                log.warn('Could not reconnect shmdata to new RTP destination');
                connectedAll = false;
            }
        }, this );
        return connectedAll;
    } else {
        return true;
    }
};

module.exports = RtpManager;