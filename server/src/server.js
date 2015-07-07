"use strict";

// Require the minimum to display greeting message
var config = require('./settings/config');
var colors = require('colors/safe');

// Parse command line
require('./lib/command-line').parse( config );

// Greeting message
console.log(colors.red.bold("Scenic " + config.version) + "\n");

var fs = require('fs');

// Create scenic home directory
if ( !fs.existsSync( config.homePath ) ) {
    try {
        fs.mkdirSync( config.homePath );
    } catch ( err ) {
        console.error( "Could not create directory: " + config.homePath + " Error: " + err.toString() );
        return process.exit(1);
    }
}

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
var SwitcherController = require('./switcher/SwitcherController');

var app;
var server;
var io;
var switcher;

async.series( [

    // Translations
    function( callback ) {
        i18n.initialize( callback );
    },

    // Server setup
    function( callback ) {
        log.info( "Setting up server..." );

        app = require('express')();
        app.use(locale(config.locale.supported));
        app.use(require('cookie-parser')());

        server = http.createServer(app);

        checkPort( 'Scenic GUI', config.scenic, callback );
    },

    // Socket.io
    function( callback ) {
        log.info( "Setting up socket.io..." );
        io = socketIo( server );
        callback();
    },

    // Switcher
    function(callback) {
        log.info( "Initializing Switcher..." );
        switcher = new SwitcherController( config, io );
        switcher.initialize( callback );
    },

    // ScenicIo Client
    function(callback) {
        log.info( "Initializing IO..." );
        scenicIo.initialize(config, io, switcher);
        callback();
    },

    // Server startup
    function( callback ) {
        log.info( "Starting server..." );
        server.listen( config.scenic.port, callback );
    },

    // Routes
    function( callback ) {
        log.info( "Setting up routes..." );
        routes( app, config, __dirname );
        callback();
    }

], function( err ) {
    if ( err ) {
        log.error( err );
        return process.exit();
    }

    var message = "\nConfiguration\n";
    message += colors.gray(repeat('–', 50)) + '\n';
    message += colors.yellow(rpad(" Home path",        25 )) + config.homePath + "\n";
    message += colors.yellow(rpad(" Scenic GUI",       25 )) + "http://" + config.host + ":" + config.scenic.port + "\n";
    message += colors.yellow(rpad(" SOAP port",        25 )) + config.soap.port + "\n";
    message += colors.yellow(rpad(" RTP session name", 25 )) + config.rtp.quiddName + "\n";
    message += colors.yellow(rpad(" Identification",   25 )) + config.nameComputer + "\n";
    message += colors.yellow(rpad(" Log level",        25 )) + config.logLevel + "\n";
    message += "\nSIP Information\n";
    message += colors.gray(repeat('–', 50)) + '\n';
    message += colors.yellow(rpad(" Address",  25 )) + config.sip.server + "\n";
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

    // GUI, unless -g is used on the command line, it will launch a chrome instance
    if (!config.standalone) {
        log.info("Opening default browser: http://" + config.host + ":" + config.scenic.port);
        var chrome = require('child_process').spawn("chromium-browser", ["--app=http://" + config.host + ":" + config.scenic.port], {
            detached: true
        } );
        chrome.unref();
        chrome.stdout.on('data', function(data) {
            log.verbose( 'chromium-browser:', data.toString().trim() );
        });
        chrome.stderr.on('data', function(data) {
            log.debug( 'chromium-browser:', 'error:', data.toString().trim() );
        });
    }
});

/**
 * close switcher when process exits
 */
process.on('exit', function() {
    switcher.close();
});

/**
 * Gracefully exit when interrupting process
 */
process.on('SIGINT', function() {
    process.exit(0);
});