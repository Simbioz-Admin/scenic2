//*** Get local address of the host ***//
var os = require('os'),
    interfaces = os.networkInterfaces(),
    addresses = [],
    scenicHomePath = process.env.HOME + "/.scenic2";

for (k in interfaces) {
    for (k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}

var config = {
    version: "0.4.9",
    host: addresses[0]
    port: {
        soap: 8085,
        scenic: 8095
    },
    sip: {
        port: 5060,
        address: "10.10.30.115",
        name: '1010'
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
    scenicSavePath: scenicHomePath + "/save_files/"
}

/* this part export config for requirejs */
if (typeof module === "undefined") {
    define([], function() {
        return config;
    })
}
/* this part export for scenic2-install */
else {
    module.exports = function(param) {
        return config;
    }
}