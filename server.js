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
, start = false;




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

// ------------------------------------ SECNIC WINDOW ---------------------------------------------//

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


// ------------------------------------ SECNIC CONFIGURATION ---------------------------------------------//

function startScenic()
{
	var serverScenic = http.createServer(app).listen(8082)
	, 	ioScenic = require('socket.io').listen(serverScenic, { log: false });

	var scenic = require("./scenic/scenic.js")($, soap_port);

	var scenicExpress = require("./scenic/scenic-express.js")($, app, scenic, __dirname);
	var scenicIo = require("./scenic/scenic-io.js")(ioScenic, scenic);

	//require("./irc.js")(io, $);
}

