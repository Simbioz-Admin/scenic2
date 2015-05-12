"use strict";

var _ = require('underscore');
var optimist = require('optimist');
var rpad = require('underscore.string/rpad');

exports.parse = function( config ) {

    var argv = optimist.argv;

    /**
     * Help
     */
    if ( argv.h || argv.helper ) {
        var message = "Scenic " + config.version + "\n\n";
        message += "Command helper for Scenic\n";
        message += "----------------------------------------------------------\n"
        message += rpad( '-v, --version', 25 ) + "Print Scenic version\n";
        message += rpad( '-f, --file', 25 ) + 'Load a Scenic file (ex : -f my_save.scenic)\n';
        message += rpad( '-n, -nogui', 25 ) + "Launch Scenic without app interface\n";
        message += rpad( '-l, --log', 25 ) + "Set the log level (default: info) [switcher|debug]\n";
        message += rpad( '-w, --withoutconf', 25 ) + 'Launch Scenic without with pre-configuration (GUI will not ask for startup configuration)\n';
        message += rpad( '-g, --guiport', 25 ) + "GUI port for Scenic (default is " + config.scenic.ports.min + ")\n";
        message += rpad( '-s, --soapport', 25 ) + "SOAP port (default is " + config.soap.ports.min + ")\n";
        message += rpad( '-i, --identification', 25 ) + "Identification name (default is " + config.nameComputer + ")\n";
        message += rpad( '-r, --rtpsession', 25 ) + "RTP session name (default is " + config.rtpsession + ")\n";
        message += rpad( '--sip', 25 ) + "SIP configuration (ex : --sip name=1010 port=" + config.sip.port + " address=" + config.sip.address + "\n";
        console.log( message );
        process.exit();
    }

    /**
     * SIP
     */
    if ( argv.sip ) {
        argv._.push( argv.sip );
        _.each( argv._, function ( param ) {
            var paramSplit = param.split( "=" );
            if ( _.contains( ['name', 'port', 'address'], paramSplit[0] ) ) {
                config.sip[paramSplit[0]] = paramSplit[1];
            }
        } );
    }

    /**
     * Version
     */
    if ( argv.v || argv.version ) {
        var version = (argv.v ? argv.v : argv.version);
        console.log( "Scenic version " + config.version );
        process.exit();
    }

    /**
     * Log level
     */
    if ( argv.l || argv.log ) {
        config.logLevel = (argv.l ? argv.l : argv.log);
    }

    /**
     * Load file
     */
    if ( argv.f || argv.file ) {
        config.loadFile = (argv.f ? argv.f : argv.file);
    }

    /**
     * GUI port
     */
    if ( argv.g || argv.guiport ) {
        var port           = (argv.g ? argv.g : argv.guiport);
        config.scenic.port = port;
    }

    /**
     * Auto launch
     */
    if ( argv.w || argv.withoutconf ) {
        config.configSet = true;
    }

    /**
     * SOAP port
     */
    if ( argv.s || argv.soapport ) {
        var port         = (argv.s ? argv.s : argv.soapport);
        config.soap.port = port;
    }

    /**
     * Identification
     */
    if ( argv.i || argv.identification ) {
        var identification  = (argv.i ? argv.i : argv.identification);
        config.nameComputer = identification;
    }

    /**
     * RTP session
     */
    if ( argv.r || argv.rtpsession ) {
        var rtpsession    = (argv.r ? argv.r : argv.rtpsession);
        config.rtpsession = rtpsession;
    }

    /**
     * Headless
     */
    var message = null;
    if ( argv.n || argv.nogui ) {
        config.standalone = true;
    }
};
