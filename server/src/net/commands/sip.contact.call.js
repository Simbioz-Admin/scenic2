var _ = require('underscore');
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Call a contact
     *
     * @param {string} uri - Contact URI
     * @param {Function} cb - Callback
     */
    execute: function ( uri, cb ) {
        if ( _.isEmpty( uri ) ) {
            return cb( i18n.t( 'Missing uri parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( uri ) ) {
            return cb( i18n.t( 'Invalid uri (__uri__)', {
                lng:  this.lang,
                uri: uri
            } ) );
        }

        try {
            var called = this.switcherController.sipManager.callContact( uri );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while calling contact __contact__ (__error__)', {
                lng:     this.lang,
                contact: uri,
                error:   e.toString()
            } ) );
        }

        if ( !called ) {
            return cb( i18n.t( 'Could not call contact __contact__', {
                lng:     this.lang,
                contact: uri
            } ) )
        }

        cb( null, called );
    }
};