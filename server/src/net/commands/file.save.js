var _ = require('underscore');
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Load file command
     *
     * @param {String} file Name of the file to save
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

        try {
            var result = this.switcherController.saveFile( file );
        } catch ( e ) {
            return cb( i18n.t('An error occurred while saving file __file__ (__error__)', {
                lng: this.lang,
                file: file,
                error: e.toString()
            }));
        }

        if ( !result ) {
            return cb( i18n.t('Could not save file __file__', {
                lng: this.lang,
                file: file
            }));
        }

        cb();
    }
};