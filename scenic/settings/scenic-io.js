define(
    [
        'http',
        'log',
        'config',
        'portastic',
        'switcher'
    ],

    function(http, log, config, portastic, switcher) {

        var initialize = function(io) {


            log.debug("Set Socket.io");

            io.sockets.on('connection', function(socket) {


                /* At the first launch interface the client ask state of scenic, launch or not */
                socket.on("scenicStart", function(callback) {
                    callback(config.scenicStart);
                });

                /* The client ask for config data */
                socket.on("getConfig", function(callback) {

                    //use socket.id for register who start the server
                    if (!config.masterSocketId) {
                        log.debug("the master socketId : ", socket.id);
                        config.masterSocketId = socket.id;
                    }

                    callback(config);
                });

                /* Before launch scenic server we check validity of the port selected */
                socket.on("checkPort", function(portnum, callback) {
                    portastic.test(parseInt(portnum), function(err, data) {
                        if (err) throw err;
                        else callback(data);
                    });
                });


                /* Client ask to  launch scenic serverSide (ask juste once) */
                socket.on("startScenic", function(params, callback) {

                    if (!config.scenicStart) {

                        config.nameComputer = params.username;
                        config.port.soap = parseInt(params.portSoap);
                        if (params.pass != "" && params.pass == params.confirmPass) {
                            ident = auth({
                                authRealm: "Private area.",
                                authList: [params.username + ':' + params.pass]
                            });
                            log("info", "password has set");
                            passSet = true;
                        }
                        switcher.initialize();
                        config.scenicStart = true;
                        //resend configuration updated
                        callback(config);
                    } else {
                        log.warn("the server scenic2 is already started");
                    }
                });

                socket.on("create", switcher.quidds.create);
                socket.on("get_quiddity_description", switcher.quidds.get_description);
                socket.on("get_properties_description", switcher.quidds.get_properties_description);
                socket.on("get_methods_description", switcher.quidds.get_methods_description);
                socket.on("get_property_value", switcher.quidds.get_property_value);
                socket.on("set_property_value", switcher.quidds.set_property_value);
                socket.on("remove", switcher.quidds.remove);
                socket.on("invoke", switcher.quidds.invoke);

            });

        }

        return {
            initialize: initialize,
        }
    }
);