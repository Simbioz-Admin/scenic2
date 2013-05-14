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
, passport = require('passport')
, DigestStrategy = require('passport-http').DigestStrategy
, sys = require('sys')
, appjs = require("appjs")
, start = false
, scenicStart = false
, serverScenic = null;

app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));
app.use(express.bodyParser());


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

var pass = false;
var soap_port = 8084;


// process.argv.forEach(function (val, index, array)
// {
//   if( val == "--password"  || val == "-p") pass = true;
//   if( val == "--soap_port" || val == "-s" && process.argv[index+1]) soap_port = process.argv[index+1];
// });

// console.log("soap port is set to ", soap_port);
// if(pass)
// {	
// 	//------ authentification ---------------------------//
// 	require("./auth.js")(app, express, passport, DigestStrategy, readline);
// } 
// else
// {
// 	app.get('/', function (req, res){
// 		  res.sendfile(__dirname + '/index.html');
// 	});
// }


// ------------------------------------ SCENIC WINDOW ---------------------------------------------//

//require("./auth.js")(app, express, passport, DigestStrategy, readline);

app.get('/panel', function (req, res)
{
	if(!start)
	{
	  res.sendfile(__dirname + '/panel.html');
	  start = true;
	}
	else
	{
		res.send("sorry you can't access to the page");
	}
});	

app.get('/', function (req, res){
	if(scenicStart)
	{
	  res.sendfile(__dirname +'/index.html');
	}
	else
	{
		res.send("Sorry server is shutdown");
	}
});



var window = appjs.createWindow({
  width  : 440,
  height : 200,
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
	socket.on("openBrowser", function(val)
	{
		if(!scenicStart)
		{
			serverScenic = new startScenic(8085);
			exec("xdg-open http://localhost:8085", puts);
		}
		else
		{
			serverScenic.close();
			console.log("closing");
		}
	});
});




// ------------------------------------ SCENIC CONFIGURATION ---------------------------------------------//



function startScenic(port)
{
	var server = http.createServer(app).listen(port);
	var	ioScenic = require('socket.io').listen(server, { log: false });

	var scenic = require("./scenic/scenic.js")($, soap_port);
	var scenicExpress = require("./scenic/scenic-express.js")($, app, scenic, __dirname, scenicStart);
	var scenicIo = require("./scenic/scenic-io.js")(ioScenic, scenic);

	this.close = function()
	{ 
		//io.sockets.emit("shutdown", "bang");
		scenicStart = false;
		console.log("server closed.");
		ioScenic.sockets.emit("shutdown", "bang");
	}

	scenicStart = true;
}

