//*** Get local address of the host ***//
var os = require('os'),
    interfaces = os.networkInterfaces(),
    addresses = [];

for (k in interfaces) {
    for (k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}

return {
    version: "0.4.5",
    host: addresses[0],
    port: {
        soap: 8085,
        scenic: 8095
    },
    rtpsession: "defaultrtp",
    logLevel: "warn",
    logSocketIo: false,
    standalone: false,
    scenicStart: false,
    configSet: false,
    passSet: null,
    loadFIle: false,
    nameComputer: os.hostname(),
    quiddExclude: ['dico', 'create_remove_spy', 'rtpsession', 'logger', 'runtime', 'logger', 'SOAPcontrolServer', 'fakesink', 'videosink'],
    propertiesExclude: ["shmdata-readers", "shmdata-writers"],
    deviceAutoDetect: ["v4l2src", "pulsesrc", "midisrc"],
    defaultPanelTable: "transfer",
    listQuiddsAndSocketId: {},
    subscribe_quidd_info: {}
}