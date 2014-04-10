define(['config', 'switcher', 'log', 'underscore', 'jquery', 'portastic'],

    function(config, switcher, log, _, $, portastic) {

        var listUsers = [];
        var io;
        var quiddSipName;

        function addListUser(userInfo) {
            log.switcher("User sip connected", userInfo.sip_url);
            listUsers.push(userInfo);
        }

        function createSip(cb) {
            /* create quiddity sip */
            quiddSipName = switcher.create("sip", "sipquid");
            if (!quiddSipName) return cb("Error login sip server");

            /* set port for sipquid */
            console.log("PORT SIP", String(config.sip.port));
            switcher.set_property_value(quiddSipName, "port", String(config.sip.port));

            /* * subscribe to the modification on this quiddity */
            switcher.subscribe_to_signal(quiddSipName, "on-tree-grafted");
            switcher.subscribe_to_signal(quiddSipName, "on-tree-pruned");

            var register = switcher.invoke(quiddSipName, "register", [config.sip.name,
                config.sip.address,
                "1234"
            ]);

            if (register == "false") return cb("Error login sip server", null);
            if (cb) cb(null);
        }

        return {
            initialize: function(socketIo) {
                log.info("initialize sip");
                io = socketIo;
                createSip();
            },
            updateInfoUser: function(userInfo) {
                try {
                    userInfo = $.parseJSON(userInfo);
                } catch (e) {
                    return log.error("error try parseJSON userInfo");
                }

                /* check if user is not already in the list */
                var userUpdated = _.findWhere(listUsers, {
                    sip_url: userInfo.sip_url
                });

                /* if no user existing in the list */
                if (!userUpdated) return addListUser(userInfo);

                /* if user exist we update info */
                var indexUserOnTheList = _.indexOf(listUsers, userUpdated);
                listUsers[indexUserOnTheList] = userInfo;

                /* send information to the client slide */
                io.sockets.emit("updateInfoUser", userInfo);
            },
            removeFromList: function(userInfo) {
                log.debug("Remove from list", userInfo);
            },
            getListUsers: function() {
                return listUsers;
            },
            login: function(sip, cb) {
                log.debug("Ask for login Sip Server", parseInt(sip.port));
                /* set information config */
                config.sip = {
                    port: sip.port,
                    address: sip.address,
                    name: sip.name
                }
                createSip(function(err) {
                    if (err) return cb(err);
                    return cb(null, config.sip);
                });
                // portastic.test(parseInt(sip.sipPort), function(err, data) {
                //     log.debug("Check port", err, data);
                //     if (err || !data) return cb(err, null);

                // })
            },
            logout: function(cb) {
                log.debug("ask for logout to the server sip");
                if (switcher.remove(quiddSipName)) {
                    listUsers = [];
                    cb(null, true);
                } else {
                    log.error("error when try logout server sip")
                    cb("error when try logout server sip", false);
                }

            }
        }


    }


);