module.exports = function (app, config, startScenic, scenicStart, io, log)
{

	var appjs = require("appjs")
	, path = require("path")
	, sys = require('sys')
	, exec = require('child_process').exec;

	var idPanel = null;
	var  serverScenic = null;

	function puts(error, stdout, stderr) { sys.puts(stdout) }

	app.get('/panel', function (req, res)
	{
		if(!idPanel)
		{
		  res.sendfile(path.join(__dirname, '..', 'panel.html'));
		  
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
	  url : 'http://'+config.host+':'+config.port.panel+'/panel/',
	  icons  : __dirname + '/content/icons'
	});

	window.on('create', function(){
	  log("info","Window Created");
	  window.frame.show();
	  window.frame.center();
	});

	window.on('ready', function(){
	  log("info","Window Ready");

	  window.addEventListener('keydown', function(e){
	    if (e.keyIdentifier === 'F12') {
	      window.frame.openDevTools();
	    }
	  });
	});

	window.on('close', function(){
	  log("info","Window Closed");
	  process.exit(0);
	});



	io.sockets.on('connection', function (socket)
	{
		socket.on("getPort", function(callback)
		{
			callback(config.port.soap, config.port.scenic);	
		});


		socket.on("setConfig", function(conf, callback)
		{
			if(conf.pass && conf.confirmPass)
			{
				require("./auth.js")(app, express, passport, DigestStrategy, conf.username, conf.pass);
				passSet = true;
				log("info", "password set!");
			}
			if(conf.username) config.nameComputer = conf.username;

			if(conf.portSoap != config.port.soap)
			{
				network.checkPort(conf.portSoap, function(port){ config.port.soap = port; });
			}

			if(conf.portScenic != config.port.scenic)
			{
				config.port.scenic = network.checkPort(conf.portScenic, function(port){ config.port.scenic = port; });
			}

			window.frame.resize(440, 200);

			callback(true);
		});

		socket.on("statusScenic", function(state, callback)
		{
			scenicStart = (state ? true : false);

			if(!serverScenic) serverScenic = new startScenic(config.port.scenic);
			callback("http://"+config.host+":"+config.port.scenic);
		});

		socket.on("openBrowser", function(val)
		{
			exec("xdg-open http://"+config.host+":"+config.port.scenic, puts);
			
		});
	});


}