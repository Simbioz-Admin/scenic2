var express = require("express")
, config = require('./scenic/config.js')
, switcher = require('node-switcher')
, $ = require('jquery')
, _ = require('underscore')
, log = require('./scenic/logger.js')(config, _)
, app = express()
, http = require('http')
, requirejs = require('requirejs')
, network = require("./scenic/settings-network.js")(config, log)
, server = http.createServer(app)
//, serverScenic = http.createServer(app)
, io = require('socket.io').listen(server, { log: config.logSocketIo })
, readline = require('readline')
, auth = require("http-auth")
, ident = false
, scenicStart = false
, passSet = false
, standalone = false;


//----------------- INIT CONFIGURATION -----------------//
// check if port express panel, express GUI, and soap port is available
//*Find a better method for check port
server.listen(config.port.scenic);



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




var scenic = require("./scenic/scenic.js")(config, switcher, $, _, io, log);
require("./scenic/irc.js")(io, $, log);
require("./scenic/scenic-express.js")(config, $, _, app, scenic, switcher, scenicStart);
require("./scenic/scenic-io.js")(config, scenicStart, io, switcher, scenic, $, _, log, network);
		
/**
 * Requesting new authentication instance.
 */


/**
 * Handler for path with authentication.
 */
app.get('/', function(req, res) {

	if(!passSet)
	{
		res.sendfile(__dirname +'/index.html');
	}
	else
	{
	    ident.apply(req, res, function(username) {
	        res.sendfile(__dirname +'/index.html');
	    });
	}
});



io.sockets.on('connection', function (socket)
{
	socket.on("getConfig", function(callback)
	{
		callback(config);
	});

	socket.on("scenicStart", function(callback)
	{
		callback(scenicStart);
	});

	socket.on("checkPort", function(port, callback)
	{
		network.checkPort(port, function(ok)
		{
			callback(ok);
		})
	});

	socket.on("startScenic", function(params, callback)
	{
		if(!scenicStart)
		{
			config.nameComputer = params.username;
			config.port.soap = params.portSoap;
			if(params.pass == params.confirmPass)
			{
				ident = auth({
				    authRealm : "Private area.",
				    authList : [params.username+':'+params.pass]
				});
				log("info", "password has set");
				passSet = true;
			}
			scenic.initialize();
			scenicStart = true;
			//resend configuration updated
			callback(config);
		}
		else
		{
			log("info", "the server scenic2 is already started");
		}
	});

});




//-------------- SCENIC CONFIGURATION -----------------------//

// function startScenic(port)
// {

// 	serverScenic.listen(port);
// 	var	ioScenic = require('socket.io').listen(serverScenic, { log: false });
// 	log("info", "the server start : http://"+config.host+":"+config.port.scenic);

// 	var scenic = require("./scenic/scenic.js")(config, switcher, $, _, ioScenic, log);
// 	require("./scenic/irc.js")(ioScenic, $, log);
// 	require("./scenic/scenic-express.js")(config, $, _, app, scenic, switcher, scenicStart);
// 	require("./scenic/scenic-io.js")(config, ioScenic, switcher, scenic, $, _, log);

// 	this.close = function()
// 	{ 
// 		//io.sockets.emit("shutdown", "bang");
// 		scenicStart = false;
// 		log("info","server closed.");
// 	}
// 	if(passSet)
// 	{

// 		app.all('/', passport.authenticate('digest', { session: false }),
// 		  function(req, res){
// 		  	if(scenicStart) res.sendfile(__dirname + '/index.html');
// 			else res.send("Sorry server is shutdown");
// 	  	});

// 	}
// 	else
// 	{
// 		app.get('/', function (req, res){
// 			if(scenicStart) res.sendfile(__dirname +'/index.html');
// 			else res.send("Sorry server is shutdown");
// 		});
// 	}

// 	scenicStart = true;
// }


// ---------- APPJS  -------------------------//

//if(!standalone) require("./scenic/appjs.js")(app, config, startScenic, scenicStart, io, log, closeServer, DigestStrategy, passport);
//startScenic(config.port.scenic);


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