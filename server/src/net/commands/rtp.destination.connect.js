var _               = require( 'underscore' );
var i18n            = require( 'i18next' );


module.exports = {
    /**
     * Connect an RTP Destination
     *
     * @param {String} id - id of the receiver
     * @param {string} path - Path of the shmdata
     * @param {int} port - Port to use
     * @param {Function} cb - Callback
     */
    execute: function ( id, path, port, cb ) {

        if ( _.isEmpty( id ) ) {
            return cb( i18n.t( 'Missing id parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( id ) ) {
            return cb( i18n.t( 'Invalid id (__id__)', {
                lng:  this.lang,
                id: id
            } ) );
        }

        if ( _.isEmpty( path ) ) {
            return cb( i18n.t( 'Missing path parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( path ) ) {
            return cb( i18n.t( 'Invalid path (__path__)', {
                lng:  this.lang,
                path: path
            } ) );
        }

        if ( !port ) {
            return cb( i18n.t( 'Missing port parameter', {
                lng: this.lang
            } ) );
        } else if ( isNaN( parseInt( port ) ) ) {
            return cb( i18n.t( 'Invalid port (__port__)', {
                lng:  this.lang,
                port: port
            } ) );
        }

        try {
            var connected = this.switcherController.rtpManager.connectRTPDestination( id, path, port );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while connecting "__shmdata__" to RTP destination "__id__" (__error__)', {
                lng:   this.lang,
                shmdata: path,
                id: id,
                error: e.toString()
            } ) );
        }

        if ( !connected ) {
            return cb( i18n.t( 'Could not connect "__shmdata__" to RTP destination "__id__"', {
                lng:  this.lang,
                shmdata: path,
                id: id
            } ) )
        }

        cb( null, connected );
    }
};