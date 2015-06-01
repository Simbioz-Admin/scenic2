"use strict";

var log = require( './logger' );

var masterSocketId;

module.exports = {

    /**
     * Initialize
     *
     * @param config
     * @param server
     * @param io
     * @param switcherController
     */
    initialize: function ( config, io, switcherController ) {
        log.debug( "Initializing Scenic Io..." );

        io.on( 'connection', function ( socket ) {

            var self = this;

            /**
             * Bind client to controller
             */
            switcherController.bindClient( socket );

            /**
             * Configuration
             */
            socket.on( "getConfig", function ( oldSocketId, newSocketId, callback ) {

                if ( masterSocketId && oldSocketId == masterSocketId ) {
                    clearTimeout( self.refreshTimeout );
                    masterSocketId = newSocketId;
                } else if ( !masterSocketId ) {
                    log.debug( "Master socket id: ", socket.id );
                    masterSocketId = socket.id;
                }

                callback( config );
            } );

            /**
             * Disconnected
             */
            socket.on( 'disconnect', function () {

                //If the user disconnecting is the "master" user, we set a timeout before exiting the application
                if ( masterSocketId == socket.id && config.standalone == false ) {
                    self.refreshTimeout = setTimeout( function () {
                        log.info( 'Last window closed, exiting...' );
                        process.exit();
                    }, 2000 );
                }

            } );

        } );
    }
};

/*

socket.on("startScenic", function(params, callback) {

    if (!config.scenicStart) {

        log.info("Starting Scenic server...");

        config.nameComputer = params.username;
        config.soap.port = parseInt(params.portSoap);

        // config.sip.address = params.sipAddress;
        // config.sip.port = params.sipPort;
        // config.sip.name = params.sipUsername;

        if (params.pass != "" && params.pass == params.confirmPass) {
            config.passSet = auth({
                authRealm: "Private area.",
                authList: [params.username + ':' + params.pass]
            });
            log.info("    - Scenic will start with password protection");
        }

        switcherControl.initialize(config, io);

        config.scenicStart = true;

        log.info("Scenic server started.");

        //resend configuration updated
        callback(config);
    } else {
        log.warn("Scenic server already started!");
    }
});

*/
