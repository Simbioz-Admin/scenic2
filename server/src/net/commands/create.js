var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Invoke method command
     *
     * @param {String} quiddityClass Class of the quiddity we want to create
     * @param {String} [quiddityId] Name of the quiddity (if not specified, only will be automatically assigned)
     * @param {Array} socketId Socket Id of the caller (soon to be deprecated)
     * @param {Function} cb Callback
     */
    execute: function ( quiddityClass, quiddityId, socketId, cb ) {
        if ( _.isEmpty( quiddityClass ) ) {
            return cb( i18n.t( 'Missing quiddity class parameter' ) );
        } else if ( !_.isString( quiddityClass ) ) {
            return cb( i18n.t( 'Invalid quiddity class (__quiddityClass__)', {quiddityClass: quiddityClass} ) );
        }

        if ( _.isEmpty( quiddityId ) ) {
            quiddityId = null; // Just make sure we send null and not any other "empty" value
        }

        try {
            var result = this.switcherController.quiddityManager.create( quiddityClass, quiddityId, socketId );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while creating quiddity of type __quiddityClass__ (__error__)', {
                quiddityClass: quiddityClass,
                error:         e.toString()
            } ) );
        }

        if ( result == null ) {
            return cb( i18n.t( 'Could not create quiddity of type __quiddityClass__', {
                quiddityClass: quiddityClass
            } ) );
        }

        cb( null, result );
    }
};