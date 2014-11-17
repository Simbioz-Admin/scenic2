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
            if(!addBuddy) return cb("Error add "+name+" to the sip server");
            var setName = switcher.invoke(quiddSipName, "name_buddy", [name, URI]);
            if(!setName) return cb("Error set name "+name);

        }


        /*
         *  @function createSip
         *  @description set the connection with the server sip. This function is called a initialization of switcher
         */

        function createSip(name, password, address, port, cb) {

            //@TODO : Encrypt client side and decrypt server side the password

            /* Create the server SIP */
            quiddSipName = switcher.create("sip", quiddSipName);
            if (!quiddSipName) return log.error("Error login sip server");
            switcher.invoke(quiddSipName, "unregister", []);

            /* Connect to the server SIP */
            log.debug("Ask connect to server sip", name+"@"+address,password);
            var register = switcher.invoke(quiddSipName, "register", [name+"@"+address,password]);
            if(!register) return log.error("Error when try login to the server SIP");

            /* subscribe to the modification on this quiddity */
            switcher.subscribe_to_signal(quiddSipName, "on-tree-grafted");
            switcher.subscribe_to_signal(quiddSipName, "on-tree-pruned");

            /* Create a dico for Users */
            var usersDico = switcher.create( "dico", "users");
            if(!usersDico) return log.error("error create dico Users");

            /* Try load file users dico */
            var loadUsers = switcher.invoke("users", "load", [ config.scenicSavePath + "users.json"]);
            if(!loadUsers) log.warn("No files existing for dico users");

            if(loadUsers){ 
              /* Load Dico Users in quiddity SIP */
              var users = JSON.parse(switcher.get_properties_description("users")).properties;

              _.each(users, function(user){
                  addUser(user.name, user["default value"], function(err){
                    if(err) return log.error(err);
                  });
              });
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
             *  @function updateInfoUser
             *  @description Update information whebn
             */

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
                //if (!userUpdated) return addListUser(userInfo);

                /* if user exist we update info */
                var indexUserOnTheList = _.indexOf(listUsers, userUpdated);
                listUsers[indexUserOnTheList] = userInfo;

                /* send information to the client slide */
                io.sockets.emit("updateInfoUser", userInfo);
            },


            /*
             *  @function removeFromList
             *  @description Remove from the list user a user (currently disable)
             */

            removeFromList: function(userInfo) {
                log.debug("Remove from list", userInfo);
            },


            /*
             *  @function getListUsers
             *  @description Return the list of users Sip (for create collection client side)
             */

            getListUsers: function() {
                var users =  $.parseJSON(switcher.get_info(quiddSipName, "."));
                log.debug("Get List users", users);
                if(!users.error){
                    return users;
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
                    cb(null, true);
                } else {
                    log.error("error when try logout server sip")
                    cb("error when try logout server sip", false);
                }

            }
        }


    }


);