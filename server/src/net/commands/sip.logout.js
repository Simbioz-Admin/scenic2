var _ = require('underscore');
var i18n = require('i18next');

module.exports = {

    /**
     * SIP Logout Command
     *
     * @param {Function} cb - Callback
     */
    execute: function( cb ) {

        try {
            var success = this.switcherController.sipManager.logout();
        } catch( e ) {
            return cb( i18n.t('An error occurred while logging out of SIP (__error__)', {
                lng: this.lang,
                error: e.toString()
            }));
        }

        if ( !success ) {
            return cb( i18n.t('Could not log out of SIP', {
                lng: this.lang
            }));
        }

        cb();
    }
};