var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Invoke method command
     *
     * @param {String} [quiddityId] Name of the quiddity (if not specified, only will be automatically assigned)
     * @param {Function} cb Callback
     */
    execute: function ( quiddityId, cb ) {
        if ( _.isEmpty( quiddityId ) ) {
            return cb( i18n.t( 'Missing quiddity parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( quiddityId ) ) {
            return cb( i18n.t( 'Invalid quiddity (__quiddity__)', {
                lng: this.lang,
                quiddity: quiddityId
            } ) );
        }

        try {
            var result = this.switcherController.quiddityManager.remove( quiddityId );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while removing quiddity __quiddity__ (__error__)', {
                lng: this.lang,
                quiddity: quiddityId,
                error:    e.toString()
            } ) );
        }

        if ( !result ) {
            return cb( i18n.t( 'Could not remove quiddity __quiddity__', {
                lng: this.lang,
                quiddity: quiddityId
            } ) );
        }

        cb( null, result );
    }
};