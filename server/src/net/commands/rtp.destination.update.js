var _               = require( 'underscore' );
var i18n            = require( 'i18next' );


module.exports = {
    /**
     * Update an RTP Destination
     *
     * @param {String} id - id of the receiver
     * @param {Object} info - Attributes to change
     * @param {Function} cb - Callback
     */
    execute: function ( id, info, cb ) {

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

        if ( _.isEmpty( info ) ) {
            return cb( i18n.t( 'Missing path parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isObject( info ) || _.isArray( info )) {
            return cb( i18n.t( 'Invalid path (__path__)', {
                lng:  this.lang,
                path: info
            } ) );
        }

        try {
            var updated = this.switcherController.rtpManager.updateRTPDestination( id, info );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while updating RTP destination "__id__" (__error__)', {
                lng:   this.lang,
                id: id,
                error: e.toString()
            } ) );
        }

        if ( !updated ) {
            return cb( i18n.t( 'Could not update RTP destination "__id__"', {
                lng:  this.lang,
                id: id
            } ) )
        }

        cb( null, updated );
    }
};