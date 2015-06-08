"use strict";

var log = require( './logger' );
var ScenicClient = require('../net/ScenicClient');


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

        /**
         * On Connection simply create a scenic client for now
         * TODO: Manage list of clients somehow
         */
        io.on( 'connection', function ( socket ) {
            var client = new ScenicClient( switcherController, config, socket );
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
