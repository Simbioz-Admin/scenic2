var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Remove contact command
     *
     * @param {String} uri - URI of the contacts
     * @param {Function} cb Callback
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
            var removed = this.switcherController.sipManager.removeContact( uri );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while removing contact __uri__ (__error__)', {
                lng:   this.lang,
                uri:   uri,
                error: e.toString()
            } ) );
        }

        if ( !removed ) {
            return cb( i18n.t( 'Could not remove contact __uri__', {
                lng:  this.lang,
                uri:  uri
            } ) )
        }

        cb( null, removed );
    }
};