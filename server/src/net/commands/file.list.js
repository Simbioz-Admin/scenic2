var i18n = require( 'i18next' );

module.exports = {
    /**
     * Get file list command
     *
     * @param {Function} cb Callback
     */
    execute: function ( cb ) {
        var self = this;
        this.switcherController.getFileList( function ( error, files ) {
            if ( error ) {
                cb( i18n.t( 'An error occurred while retrieving the file list (__error__)', {
                    lng: self.lang,
                    error: error.toString()
                } ) );
            } else {
                cb( null, files );
            }
        } );
    }
};