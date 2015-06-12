var log  = require( '../../lib/logger' );

module.exports = {
    name: 'disconnect',

    /**
     * Disconnect handler
     * Exits the process if we launched in windowed mode and the client is the master client
     */
    execute: function( ) {
        //TODO: Unbind client and remove all traces of it
        //If the user disconnecting is the "master" user, we set a timeout before exiting the application
        if ( this.getMasterSocketId() == this.socket.id && this.config.standalone == false ) {
            this.refreshTimeout = setTimeout( function () {
                //TODO: Maybe don't be that violent about it, we could notify higher up and let the app decide
                log.info( 'Last window closed, exiting...' );
                process.exit();
            }, 2000 );
        }
    }
};