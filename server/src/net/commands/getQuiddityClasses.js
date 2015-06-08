var i18n = require('i18next');

module.exports = {
    /**
     * Get quiddity classes
     *
     * @param cb
     */
    execute: function( cb ) {
        console.log();
        try {
            var classes = this.switcherController.quiddityManager.getQuiddityClasses();
        } catch ( e ) {console.log(new Error( 'pouet', e ));
            return cb( new Error( i18n.t('Could not get quiddity classes. (__error__)') ) );
        }
        cb( null, classes );
    }
};