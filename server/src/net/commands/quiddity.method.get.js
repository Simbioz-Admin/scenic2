var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Get method description command
     *
     * @param {String} quiddityId Quiddity for which we want to retrieve the method description
     * @param {String} method Method for which we want the description
     * @param {Function} cb Callback
     */
    execute: function ( quiddityId, method, cb ) {
        if ( _.isEmpty( quiddityId ) ) {
            return cb( i18n.t( 'Missing quiddity id parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( quiddityId ) ) {
            return cb( i18n.t( 'Invalid quiddity id (__quiddity__)', {
                lng:      this.lang,
                quiddity: quiddityId
            } ) );
        }

        if ( _.isEmpty( method ) ) {
            return cb( i18n.t( 'Missing method parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( method ) ) {
            return cb( i18n.t( 'Invalid method (__method__)', {
                lng:    this.lang,
                method: method
            } ) );
        }

        try {
            var methodDescription = this.switcherController.quiddityManager.getMethodDescription( quiddityId, method );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while getting method description for method __method__ on quiddity __quiddity__ (__error__)', {
                lng:      this.lang,
                quiddity: quiddityId,
                method:   method,
                error:    e.toString()
            } ) );
        }
        cb( null, methodDescription );
    }
};