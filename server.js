
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
	sys = require('sys'),
	exec = require('child_process').exec,
	auth = require("http-auth"),
	argv = require('optimist').argv,
	ident = false,
	scenicStart = false,
	passSet = false,
	standalone = false;

require("./scenic/utils.js")(_);

//set hostName with name of computer
config.nameComputer = os.hostname();



//scenic2 settings for the server start
function leftColumn(str) {
	var n = (25 - str.length);
	return str + require('underscore.string').repeat(' ', n);
}

if (argv.h || argv.helper) {

	var message = "\n\nCommand helper for scenic2 \n";
	message += "----------------------------------------------------------\n"
	message += leftColumn('-v, --version  ') + "port for GUI scenic2 (actual version " + config.version + ")\n";
	message += leftColumn('-n, -nogui     ') + "Launch scenic2 on mode standalone\n";
	message += leftColumn('-g, --guiport  ') + "port for GUI scenic2 (default is " + config.port.scenic + ")\n";
	message += leftColumn('-s, --soapport ') + "port SOAP (default is " + config.port.soap + ")\n";
	message += leftColumn('-i, --ident ') + "name of identification (default is " + config.nameComputer + ")\n";
	console.log(message);
	process.exit();
}

//parameter for get the version of scenic2
if(argv.v || argv.version) {
	var version = (argv.v ? argv.v : argv.version);
	console.log("Scenic2 v"+config.version);
	process.exit();
}

//parameter for define the port of gui scenic
if (argv.g || argv.guiport) {
	var port = (argv.g ? argv.g : argv.guiport);
	if (typeof port != "number" || port.toString().length != 4) {
		console.log("The GUI port is not valid : ", port);
		return;
	} else {
		config.port.scenic = port;
	}
}

//parameter for define port soap
if (argv.s || argv.soapport) {
	var port = (argv.s ? argv.s : argv.soapport);
	if (typeof port != "number" || port.toString().length != 4) {
		console.log("The soap port is not valid : ", port);
		return;
	} else {
		config.port.soap = port;
	}
}

//parameter for identification
if (argv.i || argv.ident) {
	var ident = (argv.i ? argv.i : argv.ident);
	config.nameComputer = ident;
}

//launch scenic2 without interface
if (argv.n || argv.nogui) {
	standalone = true;
	scenicStart = true;
	var message = '\nScenic2 is launch in standalone mode\n';
	message += "------------------------------------------------\n";
	message += leftColumn("GUI scenic2") + "http://" + config.host + ":" + config.port.scenic + "\n";
	message += leftColumn("Port SOAP") + config.port.soap + "\n";
	message += leftColumn("Identification") + config.nameComputer + "\n";
	message += "------------------------------------------------\n";
	console.log(message);
}

function puts(error, stdout, stderr) {
	sys.puts(stdout)
}

//launch the server with the port define in the file scenic/config.js
server.listen(config.port.scenic);

//param necessary for access file and use authentification
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));


//Require the differents dependencies
var scenic = require("./scenic/scenic.js")(config, switcher, $, _, io, log);
require("./scenic/irc.js")(io, $, log);
require("./scenic/scenic-express.js")(config, $, _, app, scenic, switcher, scenicStart);
require("./scenic/scenic-io.js")(config, scenicStart, io, switcher, scenic, $, _, log, network);


if (!standalone) {
	//*** Open scenic2 with default navigator ***//
	exec("chromium-browser --app=http://" + config.host + ":" + config.port.scenic, puts);
	log("info", "scenic2 automaticlly open in your browser define by default : http://" + config.host + ":" + config.port.scenic);
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
		if(!config.masterSocketId) {
			config.masterSocketId = socket.id;
		}
		
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

	//if the user started the server close the page web we stop scenic server
	socket.on('disconnect', function(){
		if(config.masterSocketId == socket.id) {
			process.exit();
		}
	});

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
