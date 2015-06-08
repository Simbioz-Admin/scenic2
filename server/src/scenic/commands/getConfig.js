var log  = require( '../../lib/logger' );

var masterSocketId;

module.exports = {
    name: 'getConfig',

    /**
     * Get config handler
     * Called at the very start of the client initialization to retrieve the configuration
     *
     * @param oldSocketId
     * @param newSocketId
     * @param cb
     * @private
     */
    execute: function( oldSocketId, newSocketId, cb ) {
        if ( masterSocketId && oldSocketId == masterSocketId ) {
            clearTimeout( this.refreshTimeout );
            masterSocketId = newSocketId;
        } else if ( !masterSocketId ) {
            log.debug( "Master socket id: ", this.socket.id );
            masterSocketId = this.socket.id;
        }
        //TODO: Only return the part actually useful for the client
        cb( this.config )
    }
};