var express = require("express")
, config = require('./scenic/config.js')
, switcher = require('node-switcher')
, $ = require('jQuery')
, _ = require('underscore')
, log = require('./scenic/logger.js')(config, _)
, app = express()
, http = require('http')
, requirejs = require('requirejs')
, network = require("./scenic/settings-network.js")(config, log)
, server = http.createServer(app)
, serverScenic = http.createServer(app)
, io = require('socket.io').listen(server, { log: config.logSocketIo })
, readline = require('readline')
, passport = require('passport')
, DigestStrategy = require('passport-http').DigestStrategy
, scenicStart = false
, passSet = false
, standalone = false;


//----------------- INIT CONFIGURATION -----------------//
// check if port express panel, express GUI, and soap port is available

network.checkPort(config.port.soap, function(port){ config.port.soap = port; });
network.checkPort(config.port.scenic, function(port){ config.port.scenic = port; });
network.checkPort(config.port.panel, function(port)
{ 
	config.port.panel = port;
	server.listen(config.port.panel);
	log("info", "the server panel start to the port "+ config.port.panel);
});


//*** ARGUMENTS LISTEN LAUCNCH APP.JS ***//

	function puts(error, stdout, stderr) { sys.puts(stdout) }
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

	process.argv.forEach(function (val, index, array)
	{
	  if(val == "-s") standalone = true;
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

//-------------- SCENIC CONFIGURATION -----------------------//

function startScenic(port)
{

	serverScenic.listen(port);
	var	ioScenic = require('socket.io').listen(serverScenic, { log: false });
	log("info", "the server start : http://"+config.host+":"+config.port.scenic);

	var scenic = require("./scenic/scenic.js")(config, switcher, $, _, ioScenic, log);
	require("./scenic/irc.js")(ioScenic, $, log);
	require("./scenic/scenic-express.js")(config, $, _, app, scenic, switcher, scenicStart);
	require("./scenic/scenic-io.js")(config, ioScenic,switcher, scenic, $, _, log);

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


// ---------- APPJS  -------------------------//

//if(!standalone) require("./scenic/appjs.js")(app, config, startScenic, scenicStart, io, log, closeServer, DigestStrategy, passport);
startScenic(config.port.scenic);


//----------- PROCESS --------------------------//

process.on('exit', function () {
	console.log('About to exit.');
});
process.on('SIGINT', function () {
	console.log('Got SIGINT.  About to exit.');
	process.exit(0);
});


function closeServer()
{
	log("info", "close server");
	io.server.close();
	//if(serverScenic) serverScenic.close();
	switcher.close();
}

 io.server.on('close', function() {
 	console.log("socketio close");


  });