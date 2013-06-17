//-- config.js
module.exports = {
	port : {
		soap : 8084,
		scenic : 8090
	},
	nameComputer : "scenic",
	ipLocal : "localhost",
	quiddExclude : ['create_remove_spy', 'rtpsession', 'logger', 'runtime', 'logger', 'SOAPcontrolServer', 'fakesink', 'videosink', 'SOAPcontrolClient'],
	propertiesExclude : ["shmdata-readers", "shmdata-writers"]
}