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
    version: "2.2.0",
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
        quiddName: 'SIP'
    },

    rtp: {
        quiddName: 'defaultrtp'
    },

    systemUsage: {
        period: 1.0,
        quiddName: 'systemusage'
    },

    nameComputer: os.hostname(),
    homePath: homePath,
    savePath: homePath + "/save_files/",
    contactsPath: homePath + "/contacts.json",
    logPath: homePath + '/logs/'
};

module.exports = config;
