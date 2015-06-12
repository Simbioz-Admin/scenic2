var log  = require( '../../lib/logger' );

var masterSocketId;

module.exports = {
    name: 'config',

    /**
     * Get config handler
     * Called at the very start of the client initialization to retrieve the configuration
     *
     * @param {String} lang - Language of the client
     * @param {String} oldSocketId - Returning clients will pass their previous socket id
     * @param {Function} cb - Callback
     */
    execute: function( lang, oldSocketId, cb ) {

        // Save language
        this.lang = lang;

        // Figure out if we are/should be the master client
        if ( this.getMasterSocketId() && oldSocketId == this.getMasterSocketId() ) {
            clearTimeout( this.refreshTimeout );
            this.setMasterSocketId( this.socket.id );
        } else if ( !this.getMasterSocketId() ) {
            log.debug( "Master socket id: ", this.socket.id );
            this.setMasterSocketId( this.socket.id);
        }

        //TODO: Only return the part actually useful for the client
        cb( this.config )
    }
};