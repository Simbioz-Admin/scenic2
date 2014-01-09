
var	os = require("os");

//-- config.js
module.exports = {
	version: "0.4.5",
	host: "localhost",
	port: {
		soap: 8085,
		scenic: 8095
	},
	rtpsession : "defaultrtp",
	logLevel: "warn",
	logSocketIo: false,
	standalone : false,
	scenicStart : false,
	configSet : false,
	loadFIle : false,
	nameComputer: os.hostname(),
	quiddExclude: ['dico', 'create_remove_spy', 'rtpsession', 'logger', 'runtime', 'logger', 'SOAPcontrolServer', 'fakesink', 'videosink', 'SOAPcontrolClient'],
	propertiesExclude: ["shmdata-readers", "shmdata-writers"],
	deviceAutoDetect: ["v4l2src", "pulsesrc"],
	defaultPanelTable: "transfer",
	listQuiddsAndSocketId: {},
	subscribe_quidd_info : {}
}