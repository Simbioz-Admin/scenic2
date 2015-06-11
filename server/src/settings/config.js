"use strict";

//*** Get local address of the host ***//
var os = require('os'),
interfaces = os.networkInterfaces(),
addresses = [],
homePath = process.env.HOME + "/.scenic";

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
      min: 8000,
      max: 8099
    },
    port: null //Automatic
  },

  // SOAP Configuration
  soap: {
    ports: {
      min: 9000,
      max: 9099
    },
    port: null, //Automatic
    quiddName: 'soap',
    controlClientPrefix: 'soapControlClient-'
  },

  // SIP Configuration
  sip: {
    port: 5060,
    server: "scenic.sat.qc.ca",
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
  homePath: homePath,
  savePath: homePath + "/save_files/",
  contactsPath: homePath + "/contacts.json",
  logPath: homePath + '/logs/'
};

module.exports = config;
