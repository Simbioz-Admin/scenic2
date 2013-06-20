var express = require("express")
, config = require('./scenic/config.js')
, log = require('./scenic/logger.js')(config)
, switcher = require('node-switcher')
, $ = require('jQuery')
, _ = require('underscore')
, app = express()
, http = require('http')
, requirejs = require('requirejs')
, network = require("./scenic/settings-network.js")(config, log)
, server = http.createServer(app)
, io = require('socket.io').listen(server, { log: config.logSocketIo })
, readline = require('readline')
, appjs = require("appjs")
, passport = require('passport')
, DigestStrategy = require('passport-http').DigestStrategy
, idPanel = false
, scenicStart = false
, serverScenic = null
, passSet = false;


//----------------- INIT CONFIGURATION -----------------//
// check if port express panel, express GUI, and soap port is available

network.checkPort(config.port.soap, function(port){ config.port.soap = port; });
network.checkPort(config.port.scenic, function(port){ config.port.scenic = port; });
network.checkPort(config.port.panel, function(port)
{ 
	config.port.panel = port;
	server.listen(config.port.panel);
});



//-------------- CONFIGURATION EXPRESS ---------------------//
//param necessart for access file and use authentification

app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));
app.use(express.bodyParser());
app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});


// ------------------------------------ SCENIC CONFIGURATION ---------------------------------------------//


function startScenic(port)
{
	var server = http.createServer(app).listen(port);
	var	ioScenic = require('socket.io').listen(server, { log: false });

	require("./scenic/irc.js")(ioScenic, $);
	var scenic = require("./scenic/scenic.js")(config, $, _, config.port.soap, ioScenic);
	var scenicExpress = require("./scenic/scenic-express.js")(config, $, _, app, scenic, __dirname, scenicStart);
	var scenicIo = require("./scenic/scenic-io.js")(config, ioScenic, scenic, $, _);

	this.close = function()
	{ 
		//io.sockets.emit("shutdown", "bang");
		scenicStart = false;
		log("info","server closed.");
	}
	if(passSet)
	{

		app.all('/', passport.authenticate('digest', { session: false }),
		  function(req, res){
		  	if(scenicStart) res.sendfile(__dirname + '/index.html');
			else res.send("Sorry server is shutdown");
	  	});

	}
	else
	{
		app.get('/', function (req, res){
			if(scenicStart) res.sendfile(__dirname +'/index.html');
			else res.send("Sorry server is shutdown");
		});
	}

	scenicStart = true;
}


// --------------- APPJS  -------------------------//

require("./scenic/appjs.js")(app, config, startScenic, scenicStart, io, log);



//----------- PROCESS --------------------------//

process.on('exit', function () {
	switcher.close();
	//io.sockets.emit("shutdown", "bang");
	console.log('About to exit.');
});
process.on('SIGINT', function () {
	switcher.close();
	console.log('Got SIGINT.  About to exit.');
	process.exit(0);
});


