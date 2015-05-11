"use strict";

require('./bootstrap' )( function( err ) {

    // Check if bootstrap generated an error
    if ( err ) {
        console.error( err );
        return process.exit();
    }
    // Require the minimum to display greeting message
    var config = require('./settings/config');
    var colors = require('colors/safe');

    // Greeting message
    console.log(colors.red.bold("Scenic " + config.version) + "\n");

    // Parse command line
    require('./lib/command-line').parse( config );

    // Start the application
    var http = require('http');
    var socketIo = require('socket.io');
    var locale = require("locale");
    var async = require('async');
    var rpad = require('underscore.string/rpad');
    var repeat = require('underscore.string/repeat');

    var checkPort = require('./utils/check-port');
    var log = require('./lib/logger');
    var i18n = require('./lib/i18n');
    var scenicIo = require('./lib/scenic-io');
    var routes = require('./controller/routes');
    var switcherControl = require('./switcher/switcher-control');

    // Autodetect ports
    async.parallel( [
        function( callback ) {
            checkPort( 'Scenic GUI', config.scenic, callback );
        },
        function( callback ) {
            checkPort( 'SOAP', config.soap, callback );
        },
        function( callback ) {
            checkPort( 'SIP', config.sip, callback );
        }
    ], function( error, result ) {
        if ( error ) {
            log.error( error );
            return process.exit();
        } else {
            launch();
        }
    });

    function launch() {

        var message = "\nConfiguration\n";
        message += colors.gray(repeat('–', 50)) + '\n';
        message += colors.yellow(rpad(" Home path",        25 )) + config.scenicDependenciesPath + "\n";
        message += colors.yellow(rpad(" Scenic GUI",       25 )) + "http://" + config.host + ":" + config.scenic.port + "\n";
        message += colors.yellow(rpad(" SOAP port",        25 )) + config.soap.port + "\n";
        message += colors.yellow(rpad(" RTP session name", 25 )) + config.rtpsession + "\n";
        message += colors.yellow(rpad(" Identification",   25 )) + config.nameComputer + "\n";
        message += colors.yellow(rpad(" Log level",        25 )) + config.logLevel + "\n";
        message += "\nSIP Information\n";
        message += colors.gray(repeat('–', 50)) + '\n';
        message += colors.yellow(rpad(" Address",  25 )) + config.sip.address + "\n";
        message += colors.yellow(rpad(" Port",     25 )) + config.sip.port + "\n";
        message += colors.yellow(rpad(" Username", 25 )) + config.sip.name + "\n";
        message += colors.gray(repeat('–', 50)) + '\n';
        message += "\n";
        if ( config.standalone ) {
            message += 'Launching in standalone mode\n';
        } else {
            message += 'Launching in GUI mode\n';
        }
        console.log(message);

        var app;
        var server;

        async.series( [
            function( callback ) {
                // Translations
                i18n.initialize( callback );
            },
            function( callback ) {
                // Server
                log.debug( "Starting servers..." );
                app = require('express')();
                app.use(locale(config.locale.supported));
                app.use(require('cookie-parser')());
                routes( app, config );

                server = http.createServer(app);
                server.listen( config.scenic.port, callback );
            },
            function( callback ) {
                // Socket.io Server
                log.debug( "Initializing sockets..." );
                var io = socketIo(server, { log: true });

                // Switcher
                if (!config.scenicStart && config.configSet) {
                    switcherControl.initialize(config, io);
                    config.scenicStart = true;
                }

                // ScenicIo Client
                scenicIo.initialize(config, io);

                // IRC Client
                //FIXME: IRC is not enabled in this version
                //irc.initialize(io);



                // GUI, unless -g is used on the command line, it will launch a chrome instance
                if (!config.standalone) {
                    log.debug("Opening default browser: http://" + config.host + ":" + config.scenic.port);
                    var chrome = require('child_process').spawn("chromium-browser", ["--app=http://" + config.host + ":" + config.scenic.port, "--no-borders", "--no-tabs"] );
                    chrome.stdout.on('data', function(data) {
                        log.debug( 'chromium-browser:', data.toString().trim() );
                    });
                    chrome.stderr.on('data', function(data) {
                        log.debug( 'chromium-browser:', 'error:', data.toString().trim() );
                    });
                }

                callback();
            }
        ], function( err ) {
            if ( err ) {
                log.error( err );
            }
        });
    }

    /**
     * close switcher when process exits
     */
    process.on('exit', function() {
        switcherControl.close();
    });

    /**
     * Gracefully exit when interrupting process
     */
    process.on('SIGINT', function() {
        process.exit(0);
    });

});