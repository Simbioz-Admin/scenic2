/** 
 *
 * 	@file server.js nodejs and server for managing communication between
 *	the interface and node-switcher, and all existing packages for control
 *	and communication
 *
 *	@author Pierre-Antoine chesnel <pa@chesnel.ca>
 *
**/

var express = require("express"),
	config = require('./scenic/config.js'),
	os = require("os"),
	switcher = require('node-switcher'),
	$ = require('jquery'),
	_ = require('underscore'),
	app = express(),
	http = require('http'),
	requirejs = require('requirejs'),
	network = require("./scenic/settings-network.js")(config, log),
	server = http.createServer(app),
	io = require('socket.io').listen(server, {
		log: config.logSocketIo
	}),
	log = require('./scenic/logger.js')(config, _, app, io, $),
	readline = require('readline'),
	sys = require('sys'),
	exec = require('child_process').exec,
	auth = require("http-auth"),
	ident = false,
	scenicStart = false,
	passSet = false,
	standalone = false;

require("./scenic/utils.js")(_);


//launch the server with the port define in the file scenic/config.js
server.listen(config.port.scenic);


//set hostName with name of computer
config.nameComputer = os.hostname();


//define folder accessible to the public level
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));


//Require the differents dependencies
var scenic = require("./scenic/scenic.js")(config, switcher, $, _, io, log);
require("./scenic/irc.js")(io, $, log);
require("./scenic/scenic-express.js")(config, $, _, app, scenic, switcher, scenicStart);
require("./scenic/scenic-io.js")(config, scenicStart, io, switcher, scenic, $, _, log, network);

//Open scenic2 with default navigator
exec("chromium-browser --user-agent='pouet' --app=http://" + config.host + ":" + config.port.scenic, puts);
log("info", "scenic2 automaticlly open in your browser define by default : http://" + config.host + ":" + config.port.scenic);


app.get('/', function(req, res) {

	if (!passSet) {
		res.sendfile(__dirname + '/index.html');
	} else {
		ident.apply(req, res, function(username) {
			res.sendfile(__dirname + '/index.html');
		});
	}
});



io.sockets.on('connection', function(socket) {
	socket.on("getConfig", function(callback) {
		callback(config);
	});

	socket.on("scenicStart", function(callback) {
		callback(scenicStart);
	});

	socket.on("checkPort", function(port, callback) {
		network.checkPort(port, function(ok) {
			callback(ok);
		})
	});

	socket.on("startScenic", function(params, callback) {
		if (!scenicStart) {
			config.nameComputer = params.username;
			config.port.soap = params.portSoap;
			if (params.pass != "" && params.pass == params.confirmPass) {
				ident = auth({
					authRealm: "Private area.",
					authList: [params.username + ':' + params.pass]
				});
				log("info", "password has set");
				passSet = true;
			}
			scenic.initialize();
			scenicStart = true;
			//resend configuration updated
			callback(config);
		} else {
			log("info", "the server scenic2 is already started");
		}
	});

});



function puts(error, stdout, stderr) {
	sys.puts(stdout)
}
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

process.argv.forEach(function(val, index, array) {
	if (val == "-s") standalone = true;
});

//----------- PROCESS --------------------------//

process.on('exit', function() {
	console.log('About to exit.');
	io.sockets.emit("shutdown", true);
});
process.on('SIGINT', function() {
	console.log('Got SIGINT.  About to exit.');
	process.exit(0);
});