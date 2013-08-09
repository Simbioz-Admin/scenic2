//-- config.js
module.exports = {
	host : "localhost",
	port : {
		soap : 8084,
		scenic : 8090
	},
	debugLevel : "info",
	logSocketIo : false,
	nameComputer : "scenic",
	quiddExclude : ['create_remove_spy', 'rtpsession', 'logger', 'runtime', 'logger', 'SOAPcontrolServer', 'fakesink', 'videosink', 'SOAPcontrolClient'],
	propertiesExclude : ["shmdata-readers", "shmdata-writers"]
}