var express = require("express")
, $ = require('jQuery')
, app = express()
, http = require('http')
, sys = require('sys')
, server= http.createServer(app).listen(8086)
, io = require('socket.io').listen(server, { log: false })
, ioClient = require('socket.io-client')
, appjs = require("appjs")
, start = false;



app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));
app.use(express.bodyParser());

var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

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



socket = ioClient.connect('localhost', {
    port: 8085
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
		console.log("open browser");
		//exec("xdg-open http://localhost:8085", puts);
		exec("./bin/node ./server.js", puts);
	});
});