var i18n = require( 'i18next' );

module.exports = {
    /**
     * Hang up on a contact
     *
     * @param {string} uri - Contact URI
     * @param {Function} cb - Callback
     */
    execute: function ( uri, cb ) {
        try {
            var hungUp = this.switcherController.sipManager.hangUpContact( uri );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while hanging up on contact __contact__ (__error__)', {
                lng:     this.lang,
                contact: uri,
                error:   e.toString()
            } ) );
        }

        if ( !hungUp ) {
            return cb( i18n.t( 'Could not hang up on contact __contact__', {
                lng:     this.lang,
                contact: uri
            } ) )
        }

        cb( null, hungUp );
    }
};