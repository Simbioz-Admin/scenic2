var i18n = require( 'i18next' );

module.exports = {
    /**
     * Get contact list command
     *
     * @param {Function} cb Callback
     */
    execute: function ( cb ) {
        try {
            var contacts = this.switcherController.sipManager.getContacts();
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while retrieving the list of contacts (__error__)', {
                lng:   this.lang,
                error: e.toString()
            } ) );
        }
        cb( null, contacts ? contacts : [] );
    }
};