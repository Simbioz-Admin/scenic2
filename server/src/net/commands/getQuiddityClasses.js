var i18n = require('i18next');

module.exports = {
    /**
     * Get quiddity classes command
     *
     * @param {Function} cb Callback
     */
    execute: function( cb ) {
        try {
            var classes = this.switcherController.quiddityManager.getQuiddityClasses();
        } catch ( e ) {
            return cb( i18n.t('An error occurred while getting quiddity classes (__error__)', { error: e.toString() } ) );
        }
        cb( null, classes );
    }
};