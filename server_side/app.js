define(
  [
    'child_process',
    'sys',
    'settings/optimist',
    'settings/log',
    'settings/express',
    'settings/config',
    'http',
    'portastic',
    'switcher/switcher',
    'socket.io',
    'settings/scenic-io',
    'settings/i18n'
  ],

  function(child_process, sys, argv, log, express, config, http, portastic, switcher, socketIo, scenicIo, i18n) {
    
    // Check port
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

      if (error) {
        return process.exit();
      } else {
        launch();
      }
    });

    function launch() {

      // Express HTTP Server
      var server = http.createServer(express);
      server.listen(config.port.scenic);

      // Socket.io Server
      var io = socketIo.listen(server, { log: false });
      scenicIo.initialize(io);


      // IRC Client
      //FIXME: IRC is not enabled in this version >> irc.initialize(io);

      // Switcher
      if (!config.scenicStart && config.configSet) {
        switcher.initialize(io);
        config.scenicStart = true;
      }

      // GUI, unless -g is used on the command line, it will launch a chrome instance
      if (!config.standalone) {
        var exec = child_process.exec;
        function puts(error, stdout, stderr) {
          sys.puts(stdout)
        }
        exec("chromium-browser --app=http://" + config.host + ":" + config.port.scenic, puts+" --no-borders --no-tabs");
        log.debug("scenic2 is going to open in your default browser: http://" + config.host + ":" + config.port.scenic);
      }
    }

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
      // switcher.close();
      process.exit(0);
    });

    return express;
  });
