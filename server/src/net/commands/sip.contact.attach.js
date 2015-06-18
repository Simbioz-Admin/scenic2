var i18n = require( 'i18next' );

module.exports = {
    /**
     * Attach Shmdata to contact
     *
     * @param {string} uri - Contact URI
     * @param {string} path - Shmdata path
     * @param {Function} cb - Callback
     */
    execute: function ( uri, path, cb ) {
        try {
            var attached = this.switcherController.sipManager.attachShmdataToContact( uri, path );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while attaching shmdata __shmdata__ to contact __contact__ (__error__)', {
                lng:     this.lang,
                shmdata: path,
                contact: uri,
                error:   e.toString()
            } ) );
        }

        if ( !attached ) {
            return cb( i18n.t( 'Could not attach shmdata __shmdata__ to contact __contact__', {
                lng:     this.lang,
                shmdata: path,
                contact: uri
            } ) )
        }

        cb( null, attached );
    }
};