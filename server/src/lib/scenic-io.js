"use strict";

var log = require( './logger' );
var ScenicClient = require('../net/ScenicClient');


module.exports = {

    /**
     * Initialize
     *
     * @param config
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