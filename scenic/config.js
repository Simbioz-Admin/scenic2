//-- config.js
module.exports = {
	host: "localhost",
	port: {
		soap: 8085,
		scenic: 8095
	},
	debugLevel: "error",
	logSocketIo: false,
	nameComputer: "scenic",
	quiddExclude: ['dico', 'create_remove_spy', 'rtpsession', 'logger', 'runtime', 'logger', 'SOAPcontrolServer',  'SOAPcontrolClient'],
	propertiesExclude: ["shmdata-readers", "shmdata-writers"],
	deviceAutoDetect: ["v4l2src", "pulsesrc"],
	defaultPanelTable: "transfer",
	listQuiddsAndSocketId: {}
}