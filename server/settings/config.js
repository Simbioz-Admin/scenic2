"use strict";

//*** Get local address of the host ***//
var os = require('os'),
interfaces = os.networkInterfaces(),
addresses = [],
scenicHomePath = process.env.HOME + "/.scenic";

for (var k in interfaces) {
  for (var k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family == 'IPv4') {
      if (!address.internal){
        addresses.unshift(address.address);
      } else {
        addresses.push(address.address);
      }
    }
  }
}

var config = {
  version: "2.0.24",
  lang : 'en',
  host: addresses[0],

  // Scenic Configuration
  scenic: {
    ports: {
      min: 8095,
      max: 8099,
      retrieve: 1
    },
    port: null //Automatic
  },

  // SOAP Configuration
  soap: {
    ports: {
      min: 8085,
      max: 8089,
      retrieve: 1
    },
    port: null //Automatic
  },

  // SIP Configuration
  sip: {
    ports: {
      min: 5060,
      max: 5069,
      retrieve: 1
    },
    port: null,
    //address: "scenic.sat.qc.ca"
    address : "10.10.30.235",
    quiddName: 'SIP'
  },

  locale: {
    supported: ['en', 'fr']
  },

  rtpsession: "defaultrtp",
  logLevel: "warn",
  logSocketIo: false,
  standalone: false,
  scenicStart: false,
  configSet: false,
  passSet: null,
  loadFile: false,
  nameComputer: os.hostname(),
  quiddExclude: ['dico', 'create_remove_spy', 'rtpsession', 'logger', 'runtime', 'logger', 'SOAPcontrolServer'],
  propertiesExclude: ["shmdata-readers", "shmdata-writers"],
  deviceAutoDetect: ["v4l2src", "pulsesrc", "midisrc"],
  defaultPanelTable: "transfer",
  listQuiddsAndSocketId: {},
  subscribe_quidd_info: {},
  scenicDependenciesPath: scenicHomePath,
  scenicSavePath: scenicHomePath + "/save_files/",
  pathLogs: scenicHomePath + '/logs/',
  systemusagePeriod: '1.0'
};

module.exports = config;
