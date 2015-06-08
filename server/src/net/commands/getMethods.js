var _ = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Get methods command
     *
     * @param {String} quiddityId Quiddity for which we want to retrieve the methods
     * @param {Function} cb Callback
     */
    execute: function ( quiddityId, cb ) {
        if ( _.isEmpty( quiddityId ) ) {
            return cb( i18n.t( 'Missing quiddity id parameter') );
        } else if ( !_.isString( quiddityId ) ) {
            return cb( i18n.t( 'Invalid quiddity id (__quiddity__)', {quiddity: quiddityId} ) );
        }
        try {
            var quiddities = this.switcherController.quiddityManager.getMethods( quiddityId );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while getting methods for quiddity __quiddity__ (__error__)', {
                quiddity: quiddityId,
                error:    e.toString()
            } ) );
        }
        cb( null, quiddities );
    }
};