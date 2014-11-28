define(
    [
        'http',
        'log',
        'config',
        'portastic',
        'node_switcher',
        'http-auth'
    ],

    function(http, log, config, portastic, switcher, auth) {

        var socketio;

        var getSocketIo = function() {
            return socketio;
        }

        var initialize = function(io) {

            socketio = io;
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
                socket.on("checkPort", function(portSoap, callback) {
                    portastic.test(parseInt(portSoap), function(err, dataSoap) {
                        if (err) return log.error(err);
                        else callback(dataSoap);
                    });
                });


                /* Client ask to  launch scenic serverSide (ask juste once) */
                socket.on("startScenic", function(params, callback) {

                    if (!config.scenicStart) {

                        config.nameComputer = params.username;
                        config.port.soap = parseInt(params.portSoap);

                        // config.sip.address = params.sipAddress;
                        // config.sip.port = params.sipPort;
                        // config.sip.name = params.sipUsername;

                        if (params.pass != "" && params.pass == params.confirmPass) {
                            config.passSet = auth({
                                authRealm: "Private area.",
                                authList: [params.username + ':' + params.pass]
                            });
                            log.debug("info", "password has set");
                        }
                        switcher.initialize(socketio);
                        config.scenicStart = true;
                        //resend configuration updated
                        callback(config);
                    } else {
                        log.warn("the server scenic2 is already started");
                    }
                });


                /* 
                 * if the user started the server close the page web we stop scenic server we detect
                 * if it 's just refresh on stock socketId in localstorga clientSide and send to the server side if define
                 */

                socket.on('disconnect', function() {
                    //remove subscribe of information modification quidd
                    delete config.subscribe_quidd_info[socket.id];
                    refreshTimeout = setTimeout(function() {
                        if (config.masterSocketId == socket.id && config.standalone == false) {
                            process.exit();
                        }
                    }, 2000);

                });


                socket.on("returnRefresh", function(oldSocketId, newSocketId) {
                    if (oldSocketId == config.masterSocketId) {
                        clearTimeout(refreshTimeout);
                        config.masterSocketId = newSocketId;
                    }
                })

                //************************* QUIDDS ****************************//

                socket.on("create", switcher.quidds.create);
                socket.on("get_quiddity_description", switcher.quidds.get_description);
                socket.on("get_info", switcher.quidds.get_info);
                socket.on("get_properties_description", switcher.quidds.get_properties_description);
                socket.on("get_methods_description", switcher.quidds.get_methods_description);
                socket.on("get_property_description", switcher.quidds.get_property_description);
                socket.on("get_property_value", switcher.quidds.get_property_value);
                socket.on("set_property_value", switcher.quidds.set_property_value);
                socket.on("get_property_by_class", switcher.quidds.get_property_by_class);
                socket.on("remove", switcher.quidds.remove);
                socket.on("invoke", switcher.quidds.invoke);
                socket.on("subscribe_info_quidd", switcher.quidds.subscribe_info_quidd);
                socket.on("unsubscribe_info_quidd", switcher.quidds.unsubscribe_info_quidd);


                //************************* DICO ****************************//

                socket.on("setPropertyValueOfDico", switcher.quidds.set_property_value_of_dico);
                socket.on("removeValuePropertyOfDico", switcher.quidds.remove_property_value_of_dico);


                //************************* DESTINATION ****************************//

                socket.on("create_destination", switcher.receivers.create_destination);
                socket.on("update_destination", switcher.receivers.update_destination);
                socket.on("remove_destination", switcher.receivers.remove_destination);
                socket.on("connect_destination", switcher.receivers.connect_destination);
                socket.on("remove_connection", switcher.receivers.remove_connection);

                //************************* SIP ****************************//

                socket.on("sip_logout", switcher.sip.logout);
                socket.on("sip_login", switcher.sip.login);
                socket.on("addUser", switcher.sip.addUser);
                socket.on("addDestinationSip", switcher.sip.addDestinationSip);
                socket.on("removeDestinationSip", switcher.sip.removeDestinationSip);
                socket.on("attachShmdataToContact", switcher.sip.attachShmdataToContact);
                socket.on("callContact", switcher.sip.callContact);
                socket.on("hangUpContact", switcher.sip.hangUpContact);

                //************************* SAVE ****************************//

                socket.on("save", switcher.save);
                socket.on("load", switcher.load);
                socket.on("remove_save", switcher.remove_save);
                socket.on("get_save_file", switcher.get_save_file);


            });

        }

        return {
            initialize: initialize,
            getSocketIo: getSocketIo
        }
    }
);