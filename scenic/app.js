define(
    [
        'argv',
        'log',
        './settings/express',
        'config',
        'http',
        'portastic',
        'switcher',
        'socket.io',
        'scenicIo'
    ],

    function(argv, log, app, config, http, portastic, switcher, socketIo, scenicIo) {


        /* Initi Socket.io*/
        var server = http.createServer(app);
        var io = socketIo.listen(server, {
            log: false
        });

        switcher.initialize(io);
        scenicIo.initialize(io);

        config.scenicStart = true;
        server.listen(config.port.scenic);


        // /* Check validity of port */
        // portastic.test(config.port.scenic, function(err, data) {

        //     var error = false;
        //     if (err) {
        //         log.error(err);
        //         error = true;
        //     }

        //     if (!data) {
        //         log.error("The port " + config.port.scenic + " isn\'t open");
        //         error = true;
        //     }

        //     if (typeof config.port.scenic != "number" && config.port.scenic.toString().length < 4) {
        //         log.error("The GUI port is not valid", config.port.scenic);
        //         error = true;
        //     }

        //     if (error) return process.exit();

        //     if (!config.scenicStart && config.configSet) {
        //         /* Initialize Socket.io */
        //         // var server = http.createServer(app);
        //         server.listen(config.port.scenic);

        //         /* waiting callback init Socket.io for launch switcher */
        //         // scenicIo.initialize(server, function(err) {
        //         //     switcher.initialize();
        //         //     config.scenicStart = true;
        //         // });
        //     }

        //     // server.listen(config.port.scenic);

        // });


        /* at the first launch server we  */
        // if (!config.scenicStart && config.configSet) {
        //     switcher.initialize();
        //     config.scenicStart = true;
        // }

        return app;
    });