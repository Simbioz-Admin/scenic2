var express = require("express"),
	config = require('./scenic/config.js'),
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
	argv = require('./scenic/arguments.js')(config),
	log = require('./scenic/logger.js')(config, _, app, io, $),
	sys = require('sys'),
	exec = require('child_process').exec,
	auth = require("http-auth"),
	ident = false,
	passSet = false;

	require("./scenic/utils.js")(_);


//launch the server with the port define in the file scenic/config.js
if (typeof config.port.scenic == "number" && config.port.scenic.toString().length == 4) {
	server.listen(config.port.scenic);
} else {
	log.error("The GUI port is not valid", config.port.scenic);
	process.exit();
}


//param necessary for access file and use authentification
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));


//Require the differents dependencies
var scenic = require("./scenic/scenic.js")(config, switcher, $, _, io, log);
require("./scenic/irc.js")(io, $, log);
require("./scenic/scenic-express.js")(config, $, _, app, scenic, switcher, config.scenicStart);
require("./scenic/scenic-io.js")(config, config.scenicStart, io, switcher, scenic, $, _, log, network);


if (!config.standalone) {
	//*** Open scenic2 with default navigator ***//
	function puts(error, stdout, stderr) { sys.puts(stdout) }
	exec("chromium-browser --app=http://" + config.host + ":" + config.port.scenic, puts)
	log.info("scenic2 automaticlly open in your browser define by default : http://" + config.host + ":" + config.port.scenic);
}


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
		//use socket.id for register who start the server
		if (!config.masterSocketId) {
			log.debug("the master socketId : ", socket.id );
			config.masterSocketId = socket.id;
		}

		callback(config);
	});

	socket.on("scenicStart", function(callback) {
		callback(config.scenicStart);
	});

	socket.on("checkPort", function(port, callback) {
		network.checkPort(port, function(ok) {
			callback(ok);
		})
	});
	log.debug(config.scenicStart, config.standalone);
	if(!config.scenicStart && config.standalone) {

		scenic.initialize();
		config.scenicStart = true;
	}

	socket.on("startScenic", function(params, callback) {

		if (!config.scenicStart) {

			config.nameComputer = params.username;
			config.port.soap = parseInt(params.portSoap);
			if (params.pass != "" && params.pass == params.confirmPass) {
				ident = auth({
					authRealm: "Private area.",
					authList: [params.username + ':' + params.pass]
				});
				log("info", "password has set");
				passSet = true;
			}
			scenic.initialize();
			config.scenicStart = true;
			//resend configuration updated
			callback(config);
		} else {
			log.warn("the server scenic2 is already started");
		}
	});

	//if the user started the server close the page web we stop scenic server
	socket.on('disconnect', function() {
		if (config.masterSocketId == socket.id && config.standalone == false) {
			process.exit();
		}
	});

});


//process for exit server
process.on('exit', function() {
	log.info('Scenic2 is now shutdown');
	io.sockets.emit("shutdown", true);
});