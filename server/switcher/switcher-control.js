"use strict";

var _ = require('underscore');
var i18n = require('i18next');
var switcher = require('switcher');
var sip = require('./sip');
var quidds = require('./quidds');
var receivers = require('./receivers');
var log = require('../lib/logger');

var config;
var io;

function initialize(cfg, socketIo) {

  log.debug("Initializing Switcher...");

  config = cfg;
  io = socketIo;

  // Register logger first
  switcher.register_log_callback(function(msg) {
    log.switcher(msg);
  });

  // Receiver
  sip.initialize(config, io);
  receivers.initialize(config, io);
  quidds.initialize(config, io);

  // SOAP Control
  switcher.create("SOAPcontrolServer", "soap");

  // Create the default quiddities necessary to use switcher
  log.debug( 'Creating RTP Session...' );
  switcher.create("rtpsession", config.rtpsession);

  // Create quiddity systemusage to get information about the CPU usage
  log.debug( 'Creating System Usage...' );
  switcher.create("systemusage", 'systemusage');
  switcher.set_property_value("systemusage", "period", config.systemusagePeriod);
  switcher.subscribe_to_signal('systemusage', "on-tree-grafted");
  switcher.subscribe_to_signal('systemusage', "on-tree-pruned");

  // Check if we have a save file to load
  if (config.loadFile) {
    log.info("Loading save file " + config.loadFile);
    var load = switcher.load_history_from_scratch(config.loadFile);
    if (load == "true") {
      log.info("Save file loaded.");
    } else {
      log.error("Save file not found!");
    }
  } else {
    // Validate SOAP port and configure quiddity, otherwise fail
    if (typeof config.soap.port == "number" && config.soap.port.toString().length >= 4) {
      switcher.invoke("soap", "set_port", [config.soap.port]);
    } else {
      log.error("Invalid SOAP port.", config.soap.port);
      process.exit();
    }

    // Create default dico
    log.debug( 'Creating Dictionaries...' );
    var dico = switcher.create("dico", "dico");
    switcher.invoke(dico, "update", ["controlProperties", "[]"]);
    switcher.invoke(dico, "update", ["destinationsRtp", "[]"]);
  }

  /**
   * Property callback
   */

  switcher.register_prop_callback(function(qname, qprop, pvalue) {

    //we exclude byte-reate because its call every second (almost a spam...)
    if (qprop != "byte-rate" && qprop != "caps") {
      log.debug('...PROP...: ', qname, ' ', qprop, ' ', pvalue);
    } else {
      io.emit("signals_properties_value", qname, qprop, pvalue);
    }


    /* ************ PROP - SIPQUID ************ */

    if (qprop == "sip-registration" && qname == config.sip.quiddName) {
      log.debug("Sip Registration", pvalue);
    }

    /* ************ PROP - STARTED ************ */

    if (qprop == "started" && pvalue == "false") {

      log.debug("remove shmdata of", qname);
      var destinations = switcher.get_property_value("dico", "destinations"),
        destinations = JSON.parse(destinations);

      _.each(destinations, function(dest) {
        _.each(dest.data_streams, function(stream) {
          log.debug(stream.quiddName, qname);
          if (stream.quiddName == qname) {
            log.debug("find quidd connected!", stream.path, stream.port);
            receivers.remove_connection(stream.path, dest.id);
          }
        });
      });

      /* check if another quiddities is associate to */
      var quidds = JSON.parse(switcher.get_quiddities_description()).quiddities;
      _.each(quidds, function(quidd) {
        if (quidd.name.indexOf("sink_") >= 0 && quidd.name.indexOf(qname) >= 0) {
          log.debug("remove sink", quidd.name);
          switcher.remove(quidd.name);
        }
      });

    }

    /* broadcast all the modification on properties */
    _.each(config.subscribe_quidd_info, function(quiddName, socketId) {
      if (quiddName == qname) {
        var socket = io.sockets.sockets[socketId];
        if (socket) socket.emit("signals_properties_value", qname, qprop, pvalue);
      }
    });

  });

  /**
   * Signal callback
   */

  switcher.register_signal_callback(function(qname, qsignal, pvalue) {

    if (qname != "systemusage") {
      log.debug('signal:', qname, qsignal, pvalue);
    }

    /* manage callback fro SIP quidd  */

    // if (qname == "sipquid" && qsignal == "on-tree-grafted") {
    //   sip.updateInfoUser(switcher.get_info(qname, pvalue[0]));
    // }
    // if (qname == "sipquid" && qsignal == "on-tree-pruned") {
    //   sip.removeFromList(switcher.get_info(qname, pvalue[0]));

    // }

    /* ON TREE GRAFTED */

    if (qname != "systemusage" && qsignal == "on-tree-grafted") {

      /* shmdata writer */

      if (pvalue[0].indexOf(".shmdata.writer") >= 0) {
        var shmdatasInfo = JSON.parse(switcher.get_info(qname, pvalue[0]));
        /* temporary add name in info (request for add by default) */
        shmdatasInfo["path"] = pvalue[0].replace(".shmdata.writer.", "");
        shmdatasInfo['quidd'] = qname;
        shmdatasInfo['type'] = "writer";
        createVuMeter(qname);
        io.emit("addShmdata", qname, shmdatasInfo);
      }

      /* Shmdata reader */

      if (pvalue[0].indexOf(".shmdata.reader") >= 0) {
        var shmdatasInfo = JSON.parse(switcher.get_info(qname, pvalue[0]));
        shmdatasInfo["path"] = pvalue[0].replace(".shmdata.reader.", "");
        shmdatasInfo['type'] = "reader";
        shmdatasInfo['quidd'] = qname;
        io.emit("addShmdata", qname, shmdatasInfo);
      }

      /* sipquidd */

      if (qname == config.sip.quiddName && pvalue[0].indexOf(".buddy") >= 0) {
        //TODO : Get Better method for get information about user without split value
        var idUser = pvalue[0].split(".")[2];
        var infoUser = JSON.parse(switcher.get_info(qname, '.buddy.' + idUser));
        io.emit('infoUser', infoUser);
      }


    }


    /* ON TREE PRUNED */

    if (qname != "systemusage" && qsignal == "on-tree-pruned") {

      //Shmdata Writer
      if (pvalue[0].indexOf(".shmdata.writer") >= 0) { //writer
        var shmdata = {
          path: pvalue[0].replace(".shmdata.writer.", ""),
          type: 'writer'
        }

        io.emit("removeShmdata", qname, shmdata);
      }

      //Shmdata Reader
      if (pvalue[0].indexOf(".shmdata.reader") >= 0) { //writer
        var shmdata = {
          path: pvalue[0].replace(".shmdata.reader.", ""),
          type: 'reader'
        }

        io.emit("removeShmdata", qname, shmdata);
      }

      if (qname == config.sip.quiddName) {
        var idUser = pvalue[0].split(".")[2];
        var infoUser = JSON.parse(switcher.get_info(qname, '.buddy.' + idUser));
        io.emit('infoUser', infoUser);
      }
    }


    /* manage callback fro systemusage quidd  */

    if (qname == "systemusage" && qsignal == "on-tree-grafted") {
      var info = switcher.get_info(qname, pvalue[0]);
      // log.debug("systemusage info", switcher.get_info(qname, pvalue[0]));
      io.emit("systemusage", info);
    }


    /* ************ SIGNAL - ON QUIDDITY CREATED ************ */

    var quiddClass = JSON.parse(switcher.get_quiddity_description(pvalue[0]));
    if (!_.contains(config.quiddExclude, quiddClass.class) && qsignal == "on-quiddity-created") {

      /* subscribe signal for properties add/remove and methods add/remove */
      switcher.subscribe_to_signal(pvalue[0], "on-property-added");
      switcher.subscribe_to_signal(pvalue[0], "on-property-removed");
      switcher.subscribe_to_signal(pvalue[0], "on-method-added");
      switcher.subscribe_to_signal(pvalue[0], "on-method-removed");
      switcher.subscribe_to_signal(pvalue[0], "on-connection-tried");

      /*subscribe to the modification on this quiddity systemusage*/
      switcher.subscribe_to_signal(pvalue[0], "on-tree-grafted");
      switcher.subscribe_to_signal(pvalue[0], "on-tree-pruned");

      /* we subscribe all properties of quidd created */
      try {
        var propDecription = switcher.get_properties_description(pvalue[0]);
        var properties = JSON.parse(switcher.get_properties_description(pvalue[0])).properties;
        _.each(properties, function(property) {
          switcher.subscribe_to_property(pvalue[0], property.name);
          log.debug("Subscribed to", pvalue[0], property.name);
        });
      } catch (e) {
        log.error("Error getting properties", e);
      }


      /* cehck if the quiddity is created by interface and send all except user created this */
      //FIXME: socket.io removed except in 1.0
      var socketIdCreatedThisQuidd = false;
      /*_.each(config.listQuiddsAndSocketId, function(socketId, quiddName) {
        if (quiddName == pvalue[0])
          socketIdCreatedThisQuidd = socketId;
        delete config.listQuiddsAndSocketId[quiddName];
      });*/
      if (socketIdCreatedThisQuidd) {
        console.log( io.sockets.clients() );
        io.except(socketIdCreatedThisQuidd).emit("create", quiddClass);
      } else {
        io.emit("create", quiddClass);
      }
    }

    /* ************ SIGNAL - ON QUIDDITY REMOVED ************ */

    /* Emits to users a quiddity is removed */
    if (qsignal == "on-quiddity-removed") {

      io.emit("remove", pvalue);
      log.debug("the quiddity " + pvalue + " is removed");
      quidds.removeElementsAssociateToQuiddRemoved(pvalue[0]);
    }

    if (qsignal == "on-property-added" || qsignal == "on-property-removed" || qsignal == "on-method-added" || qsignal == "on-method-removed") {

      log.debug("subscribe List", config.subscribe_quidd_info);
      _.each(config.subscribe_quidd_info, function(quiddName, socketId) {
        if (quiddName == qname) {
          log.debug("Sending to socket", socketId, qsignal, pvalue);
          var socket = io.sockets.sockets[socketId];
          if (socket) socket.emit('signals_properties_info', qsignal, qname, pvalue);
        }
      });

    }

    /* ************ SIGNAL - ON PROPERTY ADDED ************ */

    /* subscribe to the property added */
    if (qsignal == "on-property-added") {
      log.debug("Subscribing to property", qname, pvalue[0]);
      switcher.subscribe_to_property(qname, pvalue[0]);
    }

    /* ************ SIGNAL - ON PROPERTY REMOVED ************ */

    if (qsignal == "on-property-removed") {
      log.debug("Unsubscribing from property", qname, pvalue[0]);
      switcher.unsubscribe_to_property(qname, pvalue[0]);
    }


  });

  log.info("Scenic initialized.");
}



/**
 *  Creating a view meter for viewing continuously from the
 *  interface if the video and audio streams are sent or received
 *  @param {string} quiddName The name (id) of the quiddity
 */

function createVuMeter(quiddName) {
  log.debug("create vuMeter for " + quiddName);

  var shmdatas = JSON.parse(switcher.get_info(quiddName, ".shmdata.writer"));
  _.each(shmdatas, function(shmdata, name) {
    var vumeter = switcher.create("fakesink", "vumeter_" + name);
    if (vumeter) {
      switcher.invoke(vumeter, "connect", [name]);
      switcher.subscribe_to_property(vumeter, "byte-rate");
    }
  });
}



/* ************ SAUVEGARDE ************ */

function save(name, cb) {
  log.debug("ask for saving state");
  var save = switcher.save_history(config.scenicSavePath + name);
  cb(save);
}

function load(name, cb) {
  log.debug("loading a scenic file", config.scenicSavePath + name);
  var load = switcher.load_history_from_scratch(config.scenicSavePath + name);
  cb(load);
}

function remove_save(name, cb) {
  log.debug("Remove a scenic file", name);
  var fs = require('fs');
  fs.unlink(config.scenicSavePath + name, function(err) {
    if (err) return log.error(err);
    cb('ok');
  });

}

function get_save_file(cb) {
  var fs = require('fs');
  fs.readdir(config.scenicSavePath, function(err, dir) {
    if (err) {
      log.error(err);
      return;
    }
    cb(dir);
  });

}


function close() {
  log.info("Server scenic is now closed");
  if ( io ) {
    io.emit( "shutdown", true );
  }
  switcher.close();
}

module.exports = {
  initialize: initialize,
  sip: sip,
  quidds: quidds,
  receivers: receivers,
  close: close,
  save: save,
  load: load,
  remove_save: remove_save,
  get_save_file: get_save_file
};