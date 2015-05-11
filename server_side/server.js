"use strict";

require('./bootstrap' )( function( err ) {

    // Check if bootstrap generated an error
    if ( err ) {
        console.error( err );
        return process.exit();
    }

    // Start the application

    var http = require('http');
    var socketIo = require('socket.io');
    var portastic = require('portastic');
    var async = require('async');
    var config = require('./settings/config');
    var argv = require('./settings/optimist');
    var log = require('./settings/log');
    var express = require('./settings/express');
    var scenicIo = require('./settings/scenic-io');
    var i18n = require('./settings/i18n');
    var switcherControl = require('./switcher/switcher-control');

    function checkPort( name, config, callback ) {
        if ( config.port ) {
            // Sanity check
            if (typeof config.port != "number" && config.port.toString().length < 4) {
                return callback( 'Invalid ' + name + ' port: ' + config.port );
            }
            // Port test
            portastic.test( config.port, function( err, data ) {
                if (err) {
                    return callback(err);
                }
                if (!data) {
                    return callback( name + ' port ' + config.port + ' isn\'t available' );
                }
                callback( null, config.port );
            } );
        } else {
            // Find port
            portastic.find( config.ports, function( err, data ) {
                if (err) {
                    return callback(err);
                }
                if (!data) {
                    return callback( 'No available ' + name + ' port found in the range ' + config.min + '-' + config.max );
                }
                config.port = data;
                callback( null, config.port );
            } );
        }
    }

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

        function leftColumn(str) {
            var n = (25 - str.length);
            return str + require('underscore.string').repeat(' ', n);
        }

        var message = leftColumn(" GUI scenic2") + "http://" + config.host + ":" + config.scenic.port + "\n";
        message += leftColumn(" Port SOAP") + config.soap.port + "\n";
        message += leftColumn(" Name RTPsession") + config.rtpsession + "\n";
        message += leftColumn(" Identification") + config.nameComputer + "\n\n";

        message += "SIP information\n";
        message += "------------------------------------------------\n";
        message += leftColumn(" Address") + config.sip.address + "\n";
        message += leftColumn(" Port") + config.sip.port + "\n";
        message += leftColumn(" Username") + config.sip.name + "\n";
        message += "------------------------------------------------\n";
        console.log(message);

        // Translations
        i18n.initialize();

        // Express HTTP Server
        var server = http.createServer(express);
        server.listen( config.scenic.port, function() {

            // Socket.io Server
            var io = socketIo.listen(server, { log: false });
            scenicIo.initialize(io);

            // IRC Client
            //FIXME: IRC is not enabled in this version
            //irc.initialize(io);

            // Switcher
            if (!config.scenicStart && config.configSet) {
                switcherControl.initialize(io);
                config.scenicStart = true;
            }

            // GUI, unless -g is used on the command line, it will launch a chrome instance
            if (!config.standalone) {
                log.debug("Opening default browser: http://" + config.host + ":" + config.scenic.port);
                var chrome = require('child_process').spawn("chromium-browser", ["--app=http://" + config.host + ":" + config.scenic.port, "--no-borders", "--no-tabs"] );
                chrome.stdout.on('data', function(data) {
                    console.log( 'chromium-browser >> stdout: ' + data );
                });
                chrome.stderr.on('data', function(data) {
                    console.error( 'chromium-browser >> stderr: ' + data );
                });
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