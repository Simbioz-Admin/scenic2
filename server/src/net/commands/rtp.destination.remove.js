var _               = require( 'underscore' );
var i18n            = require( 'i18next' );


module.exports = {
    /**
     * Remove an RTP Destination
     *
     * @param {string} id - Destination id
     * @param {Function} cb - Callback
     */
    execute: function ( id, cb ) {

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

        try {
            var removed = this.switcherController.rtpManager.removeRTPDestination( id );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while removing RTP destination "__id__" (__error__)', {
                lng:   this.lang,
                id:  id,
                error: e.toString()
            } ) );
        }

        if ( !removed ) {
            return cb( i18n.t( 'Could not remove RTP destination "__id__"', {
                lng:  this.lang,
                id: id
            } ) )
        }

        cb( null, removed );
    }
};