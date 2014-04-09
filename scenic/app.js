define(
    [
        'child_process',
        'sys',
        'argv',
        'log',
        './settings/express',
        'config',
        'http',
        'portastic',
        'node_switcher',
        'socket.io',
        'scenicIo',
        './settings/irc'
    ],

    function(child_process, sys, argv, log, app, config, http, portastic, switcher, socketIo, scenicIo, irc) {

        /* Check validity of port */
        portastic.test(config.port.scenic, function(err, data) {

            var error = false;
            if (err) {
                log.error(err);
                error = true;
            }

            if (!data) {
                log.error("The port " + config.port.scenic + " isn\'t open");
                error = true;
            }

            if (typeof config.port.scenic != "number" && config.port.scenic.toString().length < 4) {
                log.error("The GUI port is not valid", config.port.scenic);
                error = true;
            }

            if (error) return process.exit();

            var server = http.createServer(app);
            server.listen(config.port.scenic);
            var io = socketIo.listen(server, {
                log: false
            });
            scenicIo.initialize(io);


            /* initialize IRC for discussion */
            irc.initialize(io);

            /* if the user ask to launch scenic without preconfiguration */
            if (!config.scenicStart && config.configSet) {
                switcher.initialize(io);
                config.scenicStart = true;
            }

            /* if user ask to launch with interface (no -g in terminal) */
            if (!config.standalone) {
                var exec = child_process.exec;
                //*** Open scenic2 with chromium browser ***//
                function puts(error, stdout, stderr) {
                    sys.puts(stdout)
                }
                exec("chromium-browser --app=http://" + config.host + ":" + config.port.scenic, puts)
                log.debug("scenic2 is going to open in your default browser: http://" + config.host + ":" + config.port.scenic);
            }
        });
        return app;
    });