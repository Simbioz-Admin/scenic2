var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Add contact command
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
            var added = this.switcherController.sipManager.addContact( uri );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while adding contact __uri__ (__error__)', {
                lng:   this.lang,
                uri:   uri,
                error: e.toString()
            } ) );
        }

        if ( !added ) {
            return cb( i18n.t( 'Could not add contact __uri__', {
                lng:  this.lang,
                uri:  uri
            } ) )
        }

        cb( null, added );
    }
};