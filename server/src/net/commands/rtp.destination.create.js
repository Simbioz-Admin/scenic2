var i18n = require( 'i18next' );

module.exports = {
    /**
     * Create an RTP Destination
     *
     * @param {string} name - Destination name
     * @param {string} host - Hostname or ip address
     * @param {int} port - SOAP port of the destination
     * @param {Function} cb - Callback
     */
    execute: function ( name, host, port, cb ) {
        try {
            var hungUp = this.switcherController.rtpManager.createRTPDestination( name, host, port );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while hanging up on contact __contact__ (__error__)', {
                lng:     this.lang,
                contact: uri,
                error:   e.toString()
            } ) );
        }

        if ( !hungUp ) {
            return cb( i18n.t( 'Could not hang up on contact __contact__', {
                lng:     this.lang,
                contact: uri
            } ) )
        }

        cb( null, hungUp );
    }
};