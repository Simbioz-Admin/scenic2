var express = require("express")
, config = require('./scenic/config.js')
, $ = require('jQuery')
, _ = require('underscore')
, app = express()
, http = require('http')
, requirejs = require('requirejs')
, server = http.createServer(app).listen(8086)
, io = require('socket.io').listen(server, { log: false })
, logo = require('./js/libs/logo.js')
, switcher = require('node-switcher')
, child_process = require('child_process')
, readline = require('readline')
, sys = require('sys')
, appjs = require("appjs")
, portchecker = require("portchecker")
, idPanel = false
, scenicStart = false
, serverScenic = null
, passSet = false
, pass = false;

app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));
app.use(express.bodyParser());



//----------------- CONFIGURATION PASSPORT AUTHENTIFICATION -----------------//

var passport = require('passport')
, 	DigestStrategy = require('passport-http').DigestStrategy;

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});



var exec = require('child_process').exec;

//please quit switcher properly
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

function puts(error, stdout, stderr) { sys.puts(stdout) }



// ------------------------------------ SCENIC WINDOW ---------------------------------------------//


app.get('/panel', function (req, res)
{
	if(!idPanel)
	{
	  res.sendfile(__dirname + '/panel.html');
	  //start = true;
	}
	else
	{
		res.send("sorry you can't access to the page");
	}
});	


var window = appjs.createWindow({
  width  : 440,
  height : 320,
  //resizable : false,
  url : 'http://localhost:8086/panel/',
  icons  : __dirname + '/content/icons'
});

window.on('create', function(){
  console.log("Window Created");
  window.frame.show();
  window.frame.center();
});

window.on('ready', function(){
  console.log("Window Ready");

  window.addEventListener('keydown', function(e){
    if (e.keyIdentifier === 'F12') {
      window.frame.openDevTools();
    }
  });
});

window.on('close', function(){
  console.log("Window Closed");
  process.exit(0);
});



io.sockets.on('connection', function (socket)
{
	
	socket.on("getPort", function(callback)
	{
		//check if port for soap and scenic is available
		portchecker.getFirstAvailable(8084, 8090, 'localhost', function(p, host)
		{ 
			config.port.soap = p;
			portchecker.getFirstAvailable(8090, 8100, 'localhost', function(p, host)
			{ 
				config.port.scenic = p;
				callback(config.port.soap, config.port.scenic);

			});

		});
	});


	socket.on("setConfig", function(conf, callback)
	{
		if(conf.pass && conf.confirmPass)
		{
			require("./auth.js")(app, express, passport, DigestStrategy, conf.username, conf.pass);
			passSet = true;
			console.log("password set!");
		}

		if(conf.portSoap != config.port.soap) config.port.soap = conf.portSoap;
		if(conf.portScenic != config.port.scenic) config.port.scenic = conf.portScenic;
		console.log("port soap : ", config.port.soap);
		window.frame.resize(440, 200);
		//window.frame.resizable = false;
		console.log(window.frame.resizable);

		callback(true);
	});

	socket.on("statusScenic", function(state, callback)
	{

		scenicStart = (state ? true : false);
		if(!serverScenic) serverScenic = new startScenic(config.port.scenic);
		callback("http://localhost:"+config.port.scenic);
	});

	socket.on("openBrowser", function(val)
	{
		exec("xdg-open http://localhost:"+config.port.scenic, puts);
		
	});
});




// ------------------------------------ SCENIC CONFIGURATION ---------------------------------------------//



function startScenic(port)
{
	var server = http.createServer(app).listen(port);
	var	ioScenic = require('socket.io').listen(server, { log: false });

	require("./irc.js")(ioScenic, $)
	var scenic = require("./scenic/scenic.js")(config, $, _, config.port.soap, ioScenic);
	var scenicExpress = require("./scenic/scenic-express.js")(config, $, _, app, scenic, __dirname, scenicStart);
	var scenicIo = require("./scenic/scenic-io.js")(config, ioScenic, scenic, $, _);

	this.close = function()
	{ 
		//io.sockets.emit("shutdown", "bang");
		scenicStart = false;
		console.log("server closed.");
		ioScenic.sockets.emit("shutdown", "bang");
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

