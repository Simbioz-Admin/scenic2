var express = require("express")
, $ = require('jQuery')
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
, passSet = false;

app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));
app.use(express.bodyParser());

var pass = false;
var portSoap = false
,	portScenic = false




//----------------- CONFIGURATION PASSPORT AUTHENTIFICATION -----------------//

var passport = require('passport')
, 	DigestStrategy = require('passport-http').DigestStrategy;

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
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
  height : 300,
  resizable : false,
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
	
	if(!idPanel)
	{
		//check if port for soap and scenic is available
		portchecker.getFirstAvailable(8084, 8090, 'localhost', function(p, host)
		{ 
			portSoap = p;
			portchecker.getFirstAvailable(8090, 8100, 'localhost', function(p, host)
			{ 
				portScenic = p;
				console.log("port", portSoap, portScenic);
				socket.emit("sendPort", portSoap, portScenic)
			});

		});
		//idPanel = socket.id;
	} 

	socket.on("setPass", function(username, pass, callback)
	{
		require("./auth.js")(app, express, passport, DigestStrategy, username, pass);
		passSet = true;
		console.log("password set!");
		callback(true);
	});

	socket.on("statusScenic", function(state, callback)
	{
		scenicStart = (state ? true : false);
		if(!serverScenic) serverScenic = new startScenic(8085);
		callback("http://localhost:8085");
	});

	socket.on("openBrowser", function(val)
	{
		exec("xdg-open http://localhost:8085", puts);
		
	});
});




// ------------------------------------ SCENIC CONFIGURATION ---------------------------------------------//



function startScenic(port)
{
	var server = http.createServer(app).listen(port);
	var	ioScenic = require('socket.io').listen(server, { log: false });

	require("./irc.js")(ioScenic, $)
	var scenic = require("./scenic/scenic.js")($, portSoap);
	var scenicExpress = require("./scenic/scenic-express.js")($, app, scenic, __dirname, scenicStart);
	var scenicIo = require("./scenic/scenic-io.js")(ioScenic, scenic);

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

