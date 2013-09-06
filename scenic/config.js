//-- config.js
module.exports = {
	host: "localhost",
	port: {
		soap: 8085,
		scenic: 8095
	},
	debugLevel: "info",
	logSocketIo: false,
	nameComputer: "scenic",
	quiddExclude: ['dico', 'create_remove_spy', 'rtpsession', 'logger', 'runtime', 'logger', 'SOAPcontrolServer', 'fakesink', 'videosink', 'SOAPcontrolClient'],
	propertiesExclude: ["shmdata-readers", "shmdata-writers"],
	deviceAutoDetect: ["v4l2src"],
	defaultPanelTable: "transfer",
	listQuiddsAndSocketId: {}
}