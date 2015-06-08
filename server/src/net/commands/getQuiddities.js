var i18n = require('i18next');

module.exports = {
    /**
     * Get quiddities command
     *
     * @param {Function} cb Callback
     */
    execute: function( cb ) {
        try {
            var quiddities = this.switcherController.quiddityManager.getQuiddities();
        } catch ( e ) {
            return cb( i18n.t('An error occurred while getting quiddities (__error__)', { error: e.toString() } ) );
        }
        cb( null, quiddities );
    }
};