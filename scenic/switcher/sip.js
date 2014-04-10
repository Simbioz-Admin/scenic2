define(['config', 'switcher', 'log', 'underscore', 'jquery'],

    function(config, switcher, log, _, $) {

        var listUsers = [];
        var io;

        function addListUser(userInfo) {
            log.switcher("User sip connected", userInfo.sip_url);
            listUsers.push(userInfo);
        }


        return {
            initialize: function(socketIo) {
                log.info("initialize sip");
                io = socketIo;
                /* create quiddity sip */
                var sipQuid = switcher.create("sip", "sipquid");

                /* set port for sipquid */
                switcher.set_property_value(sipQuid, "port", String(config.sip.port));

                /* * subscribe to the modification on this quiddity */
                switcher.subscribe_to_signal(sipQuid, "on-tree-grafted");
                switcher.subscribe_to_signal(sipQuid, "on-tree-pruned");

                switcher.invoke(sipQuid, "register", [config.sip.name,
                    config.sip.address,
                    "1234"
                ]);

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
            }
        }


    }


);