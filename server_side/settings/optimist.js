define(
    [
        'optimist',
        'settings/config',
        'underscore'
    ],

    function(optimist, config, _) {
        var argv = optimist.argv;

        //scenic2 settings for the server start
        function leftColumn(str) {
            var n = (25 - str.length);
            return str + require('underscore.string').repeat(' ', n);
        }


        if (argv.h || argv.helper) {

            var message = "\n\nCommand helper for scenic2 \n";
            message += "----------------------------------------------------------\n"
            message += leftColumn('-v, --version  ') + "port for GUI scenic2 (actual version " + config.version + ")\n";
            // message += leftColumn('-d, --debug') + 'start the server on mode debug\n';
            message += leftColumn('-f, --file') + 'load a file scenic (ex : -f my_save.scenic)\n';
            message += leftColumn('-n, -nogui     ') + "launch scenic2 without app interface\n";
            message += leftColumn('-l, --log     ') + "Set the level of log (default : info) (switcher - debug)\n";
            message += leftColumn('-w, --withoutconf') + 'launch scenic2 without the interface for pre-configuration\n';
            message += leftColumn('-g, --guiport  ') + "port for GUI scenic2 (default is " + config.port.scenic + ")\n";
            message += leftColumn('-s, --soapport ') + "port SOAP (default is " + config.port.soap + ")\n";
            message += leftColumn('-i, --identification ') + "name of identification (default is " + config.nameComputer + ")\n";
            message += leftColumn('-r, --rtpsession ') + "name of rtpsession (default is " + config.rtpsession + ")\n";
            message += leftColumn('--sip') + "parameters for server sip (ex : --sip name=1010 port=" + config.sip.port + " address=" + config.sip.address + "\n";
            console.log(message);
            process.exit();
        }

        //argument for get the version of scenic2
        if (argv.sip) {
            argv._.push(argv.sip);
            _.each(argv._, function(param) {
                var paramSplit = param.split("=");
                if (_.contains(['name', 'port', 'address'], paramSplit[0])) {
                    config.sip[paramSplit[0]] = paramSplit[1];
                }
            });
        }

        //argument for get the version of scenic2
        if (argv.v || argv.version) {
            var version = (argv.v ? argv.v : argv.version);
            console.log("Scenic2 version " + config.version);
            process.exit();
        }

        //argument for set mode debug
        if (argv.l || argv.log) {
            config.logLevel = (argv.l ? argv.l : argv.log);
            console.log("The level log is set to", config.logLevel);
        }

        //argument for set mode debug
        // if (argv.d || argv.debug) {
        //     config.logLevel = 'debug';
        //     console.log("mode debug actif");
        // }


        //argument for loading a save file scenic
        if (argv.f || argv.file) {
            config.loadFile = (argv.f ? argv.f : argv.file);
        }

        //argument for define the port of gui scenic
        if (argv.g || argv.guiport) {
            var port = (argv.g ? argv.g : argv.guiport);
            config.port.scenic = port;
        }

        //Launch scenic2 wihtout pre-configuration
        if (argv.w || argv.withoutconfi) {
            config.configSet = true;
        }

        //argument for define port soap
        if (argv.s || argv.soapport) {
            var port = (argv.s ? argv.s : argv.soapport);
            config.port.soap = port;
        }

        //argument for identification
        if (argv.i || argv.identification) {
            var identification = (argv.i ? argv.i : argv.identification);
            config.nameComputer = identification;
        }

        if (argv.r || argv.rtpsession) {
            var rtpsession = (argv.r ? argv.r : argv.rtpsession);
            config.rtpsession = rtpsession;
        }

        //launch scenic2 without interface
        if (argv.n || argv.nogui) {
            config.standalone = true;
            // config.scenicStart = true;
            var message = '\nScenic2 is launch in standalone mode\n';
            message += "------------------------------------------------\n";
            message += leftColumn(" GUI scenic2") + "http://" + config.host + ":" + config.port.scenic + "\n";
            message += leftColumn(" Port SOAP") + config.port.soap + "\n";
            message += leftColumn(" Name RTPsession") + config.rtpsession + "\n";
            message += leftColumn(" Identification") + config.nameComputer + "\n\n";

            message += "SIP information\n";
            message += "------------------------------------------------\n";
            message += leftColumn(" Address") + config.sip.address + "\n";
            message += leftColumn(" Port") + config.sip.port + "\n";
            message += leftColumn(" Username") + config.sip.name + "\n";
            message += "------------------------------------------------\n";
            console.log(message);
        }


        return argv;

    }
);
