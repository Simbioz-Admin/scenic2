
var os = require("os");
var scenicHomePath = process.env.HOME + "/.scenic2";
//-- config.js
module.exports = {
    version: "2.0.16",
    host: "localhost",
    port: {
	soap: 8085,
	scenic: 8095
    },
    rtpsession : "defaultrtp",
    logLevel: "debug",
    logSocketIo: false,
    standalone : false,
    scenicStart : false,
    configSet : false,
    loadFIle : false,
    nameComputer: os.hostname(),
    quiddExclude: ['dico', 'create_remove_spy', 'rtpsession', 'logger', 'runtime', 'logger', 'SOAPcontrolServer', 'fakesink', 'videosink'],
    propertiesExclude: ["shmdata-readers", "shmdata-writers"],
    deviceAutoDetect: ["v4l2src", "pulsesrc", "midisrc"],
    defaultPanelTable: "transfer",
    listQuiddsAndSocketId: {},
    subscribe_quidd_info : {},
    scenicDependenciesPath : scenicHomePath,
    scenicSavePath : scenicHomePath + "/save_files"
}
