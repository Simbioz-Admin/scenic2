define(['config', 'switcher', 'log', 'underscore', 'jquery', 'portastic'],

    function(config, switcher, log, _, $, portastic) {

        var listUsers = [];
        var io;
        var quiddSipName = "sipquid";

        /*
         *  @function addListUser
         *  @description add to the array listUsers a new users
         */

        function addUser(URI, name, cb) {
            log.debug("User sip connected");
            var addBuddy = switcher.invoke(quiddSipName, "add_buddy", [URI]);
            if (!addBuddy) return cb("Error add " + name + " to the sip server");
            var setName = switcher.invoke(quiddSipName, "name_buddy", [name, URI]);
            if (!setName) return cb("Error set name " + name);

            /* Insert a new entry in the dico users */
            var newEntry = switcher.invoke("usersSip", "update", [URI, name]);

            /* save the dico users */
            var saveDicoUsers = switcher.invoke("usersSip", "save", [config.scenicSavePath + "users.json"]);
            if (!saveDicoUsers) return cb("error saved dico users");

            cb(null, "User " + URI + " successfully added");
        }

        /*
         *  @function createSip
         *  @description set the connection with the server sip. This function is called a initialization of switcher
         */

        function createSip(name, password, address, port, cb) {
            log.debug("Create Sip Server ", name, address, port);
            //@TODO : Encrypt client side and decrypt server side the password

            /* Create the server SIP */
            quiddSipName = switcher.create("sip", quiddSipName);
            if (!quiddSipName) return log.error("Error login sip server");
            switcher.invoke(quiddSipName, "unregister", []);

            /* Define port for Sip Server */
            var port = switcher.set_property_value(quiddSipName, "port", port); 
            if(!port) return log.error("Error set port ",port, " for sip quiddity");

            /* Connect to the server SIP */
            log.debug("Ask connect to server sip", name + "@" + address, password);
            var register = switcher.invoke(quiddSipName, "register", [name + "@" + address, password]);
            if (!register) return log.error("Error when try login to the server SIP");

            /* subscribe to the modification on this quiddity */
            switcher.subscribe_to_signal(quiddSipName, "on-tree-grafted");
            switcher.subscribe_to_signal(quiddSipName, "on-tree-pruned");

            /* Add user connected to the sip quiddity */
            addUser(name + "@" + address, name, function(err) {
                if (err) return log.error(err);
            });

            /* Create dico for DestinationsSip */
            var destinationsSip = switcher.create('dico', 'destinationsSip');
            if (!destinationsSip) return log.error("error create dico destinationsSip");

            /* Create a dico for Users Save */
            var usersDico = switcher.create("dico", "usersSip");
            if (!usersDico) return log.error("error create dico Users");

            /* Try load file users dico */
            var loadUsers = switcher.invoke("usersSip", "load", [config.scenicSavePath + "users.json"]);
            if (!loadUsers) log.warn("No files existing for dico users");

            if (loadUsers) {
                /* Load Dico Users in quiddity SIP */
                var users = JSON.parse(switcher.get_info("usersSip", ".dico"));

                if (!users.error) {
                    _.each(users, function(username, key) {
                        addUser(key, username, function(err, info) {
                            if (err) return log.error(err);
                            log.debug(info);
                        });
                    });
                }
            }

            if (register == "false") {
                log.error("Error register quid sip");
                return cb("Error register quid sip", null);
            }

            if (cb) cb(null);
        }




        return {

            /*
             *  @function initialize
             *  @description initialize for get socket.io accessible
             */

            initialize: function(socketIo) {
                log.info("initialize sip");
                io = socketIo;
            },

            /*
             *  @function getListUsers
             *  @description Return the list of users Sip (for create collection client side)
             */

            getListUsers: function() {

                var users = $.parseJSON(switcher.get_info(quiddSipName, "."));
                /* get users added to the tab Sip */
                var destinationSip = $.parseJSON(switcher.get_info("destinationsSip", ".dico"));
                var keys = _.keys(destinationSip);
                _.each(users.buddy, function(user, i) {
                    if (_.contains(keys, user.uri)) {
                        users.buddy[i]['in_tab'] = true;
                    }
                });

                log.debug("Get List users", users);
                if (!users.error) {
                    return users.buddy;
                } else {
                    return [];
                }
            },


            /*
             *  @function login
             *  @description Log user to the server sip
             */

            login: function(sip, cb) {
                log.debug("Ask for login Sip Server", parseInt(sip.port));
                /* set information config */
                switcher.remove(quiddSipName);
                createSip(sip.name, sip.password, sip.address, sip.port, function(err) {
                    if (err) return cb(err);
                    return cb(null, sip);
                });
            },


            /*
             *  @function logout
             *  @description logout from the server SIP
             */

            logout: function(cb) {
                log.debug("ask for logout to the server sip");
                var unregister = switcher.invoke(quiddSipName, "unregister", []);
                console.log("unregister", unregister);
                if (switcher.remove(quiddSipName)) {
                    listUsers = [];
                    return cb(null, true);
                } else {
                    log.error("error when try logout server sip")
                    return cb("error when try logout server sip", false);
                }

            },

            /*
             *  @function addUser
             *  @description Add a new user in the dico and server sip
             */

            addUser: function(uri, cb) {
                log.debug("ask to add user ", uri);
                addUser(uri, uri, function(err, info) {
                    return cb(err, info);
                });
            },

            /*
             *  @function addDestinationSip
             */

            addUserToDestinationMatrix: function(uri, cb) {
                log.debug("ask to add ", uri, " to the destinationSip");

                var addDestinationSip = switcher.invoke("destinationsSip", "update", [uri, uri]);
                if (!addDestinationSip) {
                    var err = "Error add DestinationSip " + uri;
                    log.error(err);
                    cb(err);
                    return;
                }
                io.sockets.emit("addDestinationSip", uri);
                cb(null, "successfully added destination " + uri);
            },

            /*
             *  @function removeDestinationSip
             */
            removeUserToDestinationMatrix: function(uri, cb) {
                log.debug("ask to remove ", uri, " to the destinationSip");
                var removeDestinationSip = switcher.invoke("destinationsSip", "remove", [uri]);
                if (!removeDestinationSip) {
                    var err = "Error remove DestinationSip " + uri;
                    log.error(err);
                    cb(err);
                    return;
                }
                io.sockets.emit("removeDestinationSip", uri);
                cb(null, "successfully remove destination " + uri);

                /* hang up client if called */
                var call = switcher.invoke(quiddSipName, 'hang-up', [uri]);
                if (!call) {
                    var msg = 'error called uri : ' + uri;
                    log.error(msg);
                    return cb(msg)
                }
            },

            /*
             *  @function addShmdataToUserSip
             */
            attachShmdataToUser: function(user, path, attach, cb) {
                log.debug("Shmdata to contact", user, path, attach);
                var attachShm = switcher.invoke(quiddSipName, "attach_shmdata_to_contact", [path, user, String(attach)]);
                var type = (attach) ? "attach" : "detach";

                if (!attachShm) {
                    var err = "error " + type + " shmdata to the user sip";
                    log.error(err);
                    return cb(err);
                }

                // io.sockets.emit("addShmdataToUserSip", )
                cb(null, "successfully " + type + " Shmdata to the destination SIP");
            },

            callUser: function(uri, cb) {
                log.debug('Ask to call contact URI ', uri);
                var call = switcher.invoke(quiddSipName, 'call', [uri]);
                if (!call) {
                    var msg = 'error called uri : ' + uri;
                    log.error(msg);
                    return cb(msg)
                }
                cb(null, 'success called contact');

            },

            hangUpUser: function(uri, cb) {
                log.debug('Ask to hang up contact URI ', uri);
                var call = switcher.invoke(quiddSipName, 'hang-up', [uri]);
                if (!call) {
                    var msg = 'error called uri : ' + uri;
                    log.error(msg);
                    return cb(msg)
                }
                cb(null, 'success hang up contact');

            },

            updateUser: function(uri, name, statusText, status, cb) {

                if (name) {
                    log.debug('Update name of the uri ' + uri + ' by ' + name);
                    var updateName = switcher.invoke(quiddSipName, "name_buddy", [name, uri]);
                    if (!updateName) {
                        var msgError = "Error update name " + name;
                        log.error(msgError)
                        return cb(msgError);
                    }
                }

                if (statusText) {
                    var setStatusNote = switcher.set_property_value(quiddSipName, 'status-note', statusText);
                }

                if (status) {
                    var setStatus = switcher.set_property_value(quiddSipName, 'status', status);
                }

                /* Update name user of dico Users and save */
                var dicoUser = switcher.invoke("usersSip", "update", [uri, name]);
                var saveDicoUsers = switcher.invoke("usersSip", "save", [config.scenicSavePath + "users.json"]);
                if (!saveDicoUsers) return cb("error saved dico users");
                cb(null, 'successfully update ' + name);

            },

            removeUser: function(uri, cb) {
              log.debug("remove User "+uri);
              var removeBuddy = switcher.invoke(quiddSipName, "del_buddy", [uri]);
              if (!removeBuddy) return cb("Error remove " + name + " to the sip server");

              /* Remove entry in the dico users */
              var removeEntry = switcher.invoke("usersSip", "remove", [uri]);

              /* save the dico users */
              var saveDicoUsers = switcher.invoke("usersSip", "save", [config.scenicSavePath + "users.json"]);
              if (!saveDicoUsers) return cb("error saved dico users");

              cb(null, "User " + uri + " successfully removed");
              io.sockets.emit("removeUser", uri);

            },

            getListStatus : function(cb){
                log.debug('ask get list users');
                var listStatus = switcher.get_property_description(quiddSipName, "status");
                if(listStatus != ""){
                    cb(null, JSON.parse(listStatus).values);
                }
                else {
                    cb(null,[]);
                }
            }

        }


    }


);