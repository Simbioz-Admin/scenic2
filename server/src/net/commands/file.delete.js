var _ = require('underscore');
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Delete file command
     *
     * @param {String} file File name to delete
     * @param {Function} cb Callback
     */
    execute: function ( file, cb ) {
        if ( _.isEmpty( file ) ) {
            return cb( i18n.t( 'Missing file name parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( file ) ) {
            return cb( i18n.t( 'Invalid file name (__file__)', {
                lng: this.lang,
                file: file
            } ) );
        }

        var self = this;
        this.switcherController.deleteFile( file, function ( error, files ) {
            if ( error ) {
                cb( i18n.t( 'An error occurred while retrieving the file list (__error__)', {
                    lng: self.lang,
                    error: error.toString()
                } ) );
            } else {
                cb( );
            }
        } );
    }
};