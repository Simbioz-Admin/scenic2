var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {

    /**
     * Hangs up ans disconnects a contact from all shmdata
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
                lng: this.lang,
                uri: uri
            } ) );
        }

        try {
            var disconnected = this.switcherController.sipManager.disconnectContact( uri );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while disconnecting contact __contact__ (__error__)', {
                lng:     this.lang,
                contact: uri,
                error:   e.toString()
            } ) );
        }

        if ( !disconnected ) {
            return cb( i18n.t( 'Could not disconnect contact __contact__', {
                lng:     this.lang,
                contact: uri
            } ) )
        }

        cb( null, disconnected );
    }
};