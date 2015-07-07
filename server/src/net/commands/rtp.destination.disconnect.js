var _               = require( 'underscore' );
var i18n            = require( 'i18next' );


module.exports = {
    /**
     * Disconnect an RTP Destination
     *
     * @param {String} id - id of the receiver
     * @param {string} path - Path of the shmdata
     * @param {Function} cb - Callback
     */
    execute: function ( id, path, cb ) {

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

        try {
            var disconnected = this.switcherController.rtpManager.disconnectRTPDestination( id, path );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while disconnecting "__shmdata__" from RTP destination "__id__" (__error__)', {
                lng:   this.lang,
                shmdata: path,
                id: id,
                error: e.toString()
            } ) );
        }

        if ( !disconnected ) {
            return cb( i18n.t( 'Could not disconnect "__shmdata__" from RTP destination "__id__"', {
                lng:  this.lang,
                shmdata: path,
                id: id
            } ) )
        }

        cb( null, disconnected );
    }
};