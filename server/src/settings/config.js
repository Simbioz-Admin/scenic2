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
  version: "2.1.0",
  lang : 'en',
  host: addresses[0],

  // Scenic Configuration
  scenic: {
    ports: {
      min: 8095,
      max: 8099
    },
    port: null //Automatic
  },

  // SOAP Configuration
  soap: {
    ports: {
      min: 8085,
      max: 8089
    },
    port: null, //Automatic
    quiddName: 'soap',
    controlClientPrefix: 'soapControlClient-'
  },

  // SIP Configuration
  sip: {
    ports: {
      min: 5060,
      max: 5069
    },
    port: null,
    server: "scenic.sat.qc.ca",
    //server : "10.10.30.247",
    quiddName: 'SIP'
  },

  rtp: {
    quiddName: 'defaultrtp'
  },

  // System Usage
  systemUsage: {
    period: 1.0, // In seconds
    quiddName: 'systemusage'
  },

  locale: {
    supported: ['en', 'fr']
  },

  defaultPanelPage: 'sip',





  logLevel: "warn",
  standalone: false,
  passSet: null,
  loadFile: false,
  nameComputer: os.hostname(),
  scenicDependenciesPath: scenicHomePath,
  scenicSavePath: scenicHomePath + "/save_files/",
  pathLogs: scenicHomePath + '/logs/',
};

module.exports = config;
