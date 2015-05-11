"use strict";

var log = require('./log');
var config = require('./config');
var portastic = require('portastic');
var switcherControl = require('../switcher/switcher-control');
var auth = require('http-auth');

module.exports = {
  initialize: function(io) {
    log.debug("Initializing ScenicIO...");
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

          log.info("Starting Scenic server...");

          config.nameComputer = params.username;
          config.soap.port = parseInt(params.portSoap);

          // config.sip.address = params.sipAddress;
          // config.sip.port = params.sipPort;
          // config.sip.name = params.sipUsername;

          if (params.pass != "" && params.pass == params.confirmPass) {
            config.passSet = auth({
              authRealm: "Private area.",
              authList: [params.username + ':' + params.pass]
            });
            log.info("    - Scenic will start with password protection");
          }

          switcherControl.initialize(io);

          config.scenicStart = true;

          log.info("Scenic server started.");

          //resend configuration updated
          callback(config);
        } else {
          log.warn("Scenic server already started!");
        }
      });


      /*
       * if the user started the server close the page web we stop scenic server we detect
       * if it 's just refresh on stock socketId in localstorga clientSide and send to the server side if define
       */

      socket.on('disconnect', function() {
        //remove subscribe of information modification quidd
        delete config.subscribe_quidd_info[socket.id];
        this.refreshTimeout = setTimeout(function() {
          if (config.masterSocketId == socket.id && config.standalone == false) {
            log.info('Last window closed, exiting...');
            process.exit();
          }
        }, 2000);

      });


      socket.on("returnRefresh", function(oldSocketId, newSocketId) {
        if (oldSocketId == config.masterSocketId) {
          clearTimeout(this.refreshTimeout);
          config.masterSocketId = newSocketId;
        }
      });

      //************************* QUIDDS ****************************//

      socket.on("create", switcherControl.quidds.create);
      socket.on("get_quiddity_description", switcherControl.quidds.get_description);
      socket.on("get_info", switcherControl.quidds.get_info);
      socket.on("get_properties_description", switcherControl.quidds.get_properties_description);
      socket.on("get_methods_description", switcherControl.quidds.get_methods_description);
      socket.on("get_method_description", switcherControl.quidds.get_method_description);
      socket.on("get_property_description", switcherControl.quidds.get_property_description);
      socket.on("get_property_value", switcherControl.quidds.get_property_value);
      socket.on("set_property_value", switcherControl.quidds.set_property_value);
      socket.on("get_property_by_class", switcherControl.quidds.get_property_by_class);
      socket.on("remove", switcherControl.quidds.remove);
      socket.on("invoke", switcherControl.quidds.invoke);
      socket.on("subscribe_info_quidd", switcherControl.quidds.subscribe_info_quidd);
      socket.on("unsubscribe_info_quidd", switcherControl.quidds.unsubscribe_info_quidd);


      //************************* DICO ****************************//

      socket.on("setPropertyValueOfDico", switcherControl.quidds.set_property_value_of_dico);
      socket.on("removeValuePropertyOfDico", switcherControl.quidds.remove_property_value_of_dico);


      //************************* DESTINATION ****************************//

      socket.on("create_destination", switcherControl.receivers.create_destination);
      socket.on("update_destination", switcherControl.receivers.update_destination);
      socket.on("remove_destination", switcherControl.receivers.remove_destination);
      socket.on("connect_destination", switcherControl.receivers.connect_destination);
      socket.on("remove_connection", switcherControl.receivers.remove_connection);

      //************************* SIP ****************************//

      socket.on("sip_logout", switcherControl.sip.logout);
      socket.on("sip_login", switcherControl.sip.login);
      socket.on("addUser", switcherControl.sip.addUser);
      socket.on("addUserToDestinationMatrix", switcherControl.sip.addUserToDestinationMatrix);
      socket.on("removeUserToDestinationMatrix", switcherControl.sip.removeUserToDestinationMatrix);
      socket.on("attachShmdataToUser", switcherControl.sip.attachShmdataToUser);
      socket.on("callUser", switcherControl.sip.callUser);
      socket.on("getListStatus", switcherControl.sip.getListStatus);
      socket.on("hangUpUser", switcherControl.sip.hangUpUser);
      socket.on("removeUser", switcherControl.sip.removeUser);

      //************************* SAVE ****************************//

      socket.on("save", switcherControl.save);
      socket.on("load", switcherControl.load);
      socket.on("remove_save", switcherControl.remove_save);
      socket.on("get_save_file", switcherControl.get_save_file);
    });
  }
};