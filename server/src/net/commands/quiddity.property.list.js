var _ = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Get properties command
     *
     * @param {String} quiddityId Quiddity for which we want to retrieve the properties
     * @param {Function} cb Callback
     */
    execute: function ( quiddityId, cb ) {
        if ( _.isEmpty( quiddityId ) ) {
            return cb( i18n.t( 'Missing quiddity id parameter', {
                lng: this.lang
            }) );
        } else if ( !_.isString( quiddityId ) ) {
            return cb( i18n.t( 'Invalid quiddity id (__quiddity__)', {
                lng: this.lang,
                quiddity: quiddityId
            } ) );
        }
        try {
            var quiddities = this.switcherController.quiddityManager.getProperties( quiddityId );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while getting properties for quiddity __quiddity__ (__error__)', {
                lng: this.lang,
                quiddity: quiddityId,
                error:    e.toString()
            } ) );
        }
        cb( null, quiddities );
    }
};