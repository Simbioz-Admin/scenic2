"use strict";

var portastic = require('portastic');
var cryptoJS = require('crypto-js');
var i18next = require('i18next');
var switcher = require('switcher');
var log = require('../lib/logger');

var listUsers = [];
var config;
var io;
var secretString = 'Les patates sont douces!';

/*
 *  @function addListUser
 *  @description add to the array listUsers a new users
 */
function addUser(URI, name, cb) {
  log.debug("Adding SIP user...");
  var addBuddy = switcher.invoke(config.sip.quiddName, "add_buddy", [URI]);
  if (!addBuddy) return cb("Error adding SIP user " + URI );
  var setName = switcher.invoke(config.sip.quiddName, "name_buddy", [name, URI]);
  if (!setName) return cb("Error setting SIP user name to " + name + " for " + URI);

  /* Insert a new entry in the dico users */
  var newEntry = switcher.invoke("usersSip", "update", [URI, name]);

  /* save the dico users */
  var usersSavePath = config.scenicSavePath + "users.json";
  var saveDicoUsers = switcher.invoke("usersSip", "save", [usersSavePath]);
  if (!saveDicoUsers) return cb("Error saving usersSip dictionary to " + usersSavePath );

  cb(null, "Successfully added SIP user " + URI );
}

/*
 *  @function createSip
 *  @description set the connection with the server sip. This function is called a initialization of switcher
 */
function createSip(name, password, address, port, cb) {
  log.debug("Creating SIP quiddity", {name: name, address: address, port: port });
  //@TODO : Encrypt client side and decrypt server side the password

  /* Create the server SIP */
  config.sip.quiddName = switcher.create("sip", config.sip.quiddName);
  if (!config.sip.quiddName) {
    var msgError = i18n.t("Error creating SIP quiddity");
    log.error(msgError);
    return cb(msgError);
  }
  switcher.subscribe_to_property(config.sip.quiddName, 'sip-registration');
  switcher.invoke(config.sip.quiddName, "unregister", []);

  /* Define port for Sip Server */
  var port = switcher.set_property_value(config.sip.quiddName, "port", port);
  if (!port) return log.error("Error setting SIP quiddity port to " + port );

  /* Connect to the server SIP */
  log.debug("Attempting SIP server connection", { name: name + "@" + address, password: password });

  var decrypted = cryptoJS.AES.decrypt(password, secretString).toString(cryptoJS.enc.Utf8);

  var register = switcher.invoke(config.sip.quiddName, "register", [name + "@" + address, decrypted]);
  if (!register) return log.error(i18n.t("SIP server authentication failed"));

  /* subscribe to the modification on this quiddity */
  switcher.subscribe_to_signal(config.sip.quiddName, "on-tree-grafted");
  switcher.subscribe_to_signal(config.sip.quiddName, "on-tree-pruned");

  /* Add user connected to the sip quiddity */
  addUser(name + "@" + address, name, function(err) {
    if (err) return log.error(err);
  });

  /* Create dico for DestinationsSip */
  var destinationsSip = switcher.create('dico', 'destinationsSip');
  if (!destinationsSip) return log.error("Error creating destinationsSip dictionary");

  /* Create a dico for Users Save */
  var usersDico = switcher.create("dico", "usersSip");
  if (!usersDico) return log.error("Error creating usersSip dictionary");

  /* Try load file users dico */
  var loadUsers = switcher.invoke("usersSip", "load", [config.scenicSavePath + "/users.json"]);
  if (!loadUsers) log.warn("No saved file exists for usersSip dictionary");

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
    var msgErr = i18n.t("Error registering SIP quiddity");
    log.error(msgErr);
    return cb(msgErr, null);
  }

  if (cb) cb(null);
}

module.exports = {

  /*
   *  @function initialize
   *  @description initialize for get socket.io accessible
   */
  initialize: function(cfg, socketIo) {
    log.debug("Initializing SIP...");
    config = cfg;
    io = socketIo;
  },

  /*
   *  @function getListUsers
   *  @description Return the list of users Sip (for create collection client side)
   */
  getListUsers: function() {

    var users = JSON.parse(switcher.get_info(config.sip.quiddName, "."));
    /* get users added to the tab Sip */
    var destinationSip = JSON.parse(switcher.get_info("destinationsSip", ".dico"));
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
    log.debug("SIP login attempt: " + sip.name + '@' + sip.address + ':' + sip.port );

    // Remove potential previous SIP quiddity
    switcher.remove(config.sip.quiddName);

    // Create new SIP quiddity
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
    var unregister = switcher.invoke(config.sip.quiddName, "unregister", []);
    console.log("unregister", unregister);
    if (switcher.remove(config.sip.quiddName)) {
      listUsers = [];
      return cb(null, true);
    } else {
      var msgErr = i18n.t("error when try logout server sip");
      log.error(msgErr)
      return cb(msgErr, false);
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
      var err = i18n.t("Error add DestinationSip ") + uri;
      log.error(err);
      cb(err);
      return;
    }
    io.emit("addDestinationSip", uri);
    cb(null, "successfully added destination " + uri);
  },

  /*
   *  @function removeDestinationSip
   */
  removeUserToDestinationMatrix: function(uri, cb) {
    log.debug("ask to remove ", uri, " to the destinationSip");
    var removeDestinationSip = switcher.invoke("destinationsSip", "remove", [uri]);
    if (!removeDestinationSip) {
      var err = i18n.t("Error remove DestinationSip ") + uri;
      log.error(err);
      cb(err);
      return;
    }
    io.emit("removeDestinationSip", uri);
    cb(null, i18n.t("successfully remove destination ") + uri);

    /* hang up client if called */
    var call = switcher.invoke(config.sip.quiddName, 'hang-up', [uri]);
    if (!call) {
      var msg = i18n.t('error called uri : ') + uri;
      log.error(msg);
      return cb(msg)
    }
  },

  /*
   *  @function addShmdataToUserSip
   */
  attachShmdataToUser: function(user, path, attach, cb) {
    log.debug("Shmdata to contact", user, path, attach);
    var attachShm = switcher.invoke(config.sip.quiddName, "attach_shmdata_to_contact", [path, user, String(attach)]);
    var type = (attach) ? "attach" : "detach";

    if (!attachShm) {
      var err = "error " + type + " shmdata to the user sip";
      log.error(err);
      return cb(err);
    }

    // io.emit("addShmdataToUserSip", )
    cb(null, "successfully " + type + " Shmdata to the destination SIP");
  },

  callUser: function(uri, cb) {
    log.debug('Ask to call contact URI ', uri);
    var call = switcher.invoke(config.sip.quiddName, 'call', [uri]);
    if (!call) {
      var msg = 'error called uri : ' + uri;
      log.error(msg);
      return cb(msg)
    }
    cb(null, 'success called contact');

  },

  hangUpUser: function(uri, cb) {
    log.debug('Ask to hang up contact URI ', uri);
    var call = switcher.invoke(config.sip.quiddName, 'hang-up', [uri]);
    if (!call) {
      var msg = 'error called uri : ' + uri;
      log.error(msg);
      return cb(msg)
    }
    cb(null, i18n.t('success hang up contact'));

  },

  updateUser: function(uri, name, statusText, status, cb) {

    if (name) {
      log.debug('Update name of the uri ' + uri + ' by ' + name);
      var updateName = switcher.invoke(config.sip.quiddName, "name_buddy", [name, uri]);
      if (!updateName) {
        var msgError = "Error update name " + name;
        log.error(msgError)
        return cb(msgError);
      }
    }

    if (statusText) {
      var setStatusNote = switcher.set_property_value(config.sip.quiddName, 'status-note', statusText);
    }

    if (status) {
      var setStatus = switcher.set_property_value(config.sip.quiddName, 'status', status);
    }

    /* Update name user of dico Users and save */
    var dicoUser = switcher.invoke("usersSip", "update", [uri, name]);
    var saveDicoUsers = switcher.invoke("usersSip", "save", [config.scenicSavePath + "/users.json"]);
    if (!saveDicoUsers) return cb("error saved dico users");
    cb(null, i18n.t('successfully update ') + name);

  },

  removeUser: function(uri, cb) {
    log.debug("remove User " + uri);
    var removeBuddy = switcher.invoke(config.sip.quiddName, "del_buddy", [uri]);
    if (!removeBuddy) return cb(i18n.t("Error remove __name__ to the sip server", {name:name}));

    /* Remove entry in the dico users */
    var removeEntry = switcher.invoke("usersSip", "remove", [uri]);

    /* save the dico users */
    var saveDicoUsers = switcher.invoke("usersSip", "save", [config.scenicSavePath + "/users.json"]);
    if (!saveDicoUsers) return cb(i18n.t("error saved dico users"));

    cb(null, i18n.t("User __uri__ successfully removed", {uri : uri }));
    io.emit("removeUser", uri);

  },

  getListStatus: function(cb) {
    log.debug('ask get list users');
    var listStatus = switcher.get_property_description(config.sip.quiddName, "status");
    if (listStatus != "") {
      cb(null, JSON.parse(listStatus).values);
    } else {
      cb(null, []);
    }
  }

};