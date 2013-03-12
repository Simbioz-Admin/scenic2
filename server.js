var express = require("express")
, $ = require('jQuery')
, app = express()
, http = require('http')
, requirejs = require('requirejs')
, server= http.createServer(app)
, io = require('socket.io').listen(server, { log: true })
, logo = require('./js/libs/logo.js')
, switcher = require('node-switcher');

server.listen(8085);

app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));

//please quit switcher properly
process.on('exit', function () {
    switcher.close();
    console.log('About to exit.');
});
process.on('SIGINT', function () {
    switcher.close();
    console.log('Got SIGINT.  About to exit.');
    process.exit(0);
});

// ------------------------------------ WEB APP ---------------------------------------------//

// routing

app.get('/', function (req, res){
  res.sendfile(__dirname + '/index.html');
});

app.get('/classes_doc', function(request, response) {
  response.contentType('application/json');
  response.send(classesWithProperties());
});

app.get('/quidds', function(request, response) {
  response.contentType('application/json');
  response.send(switcher.get_quiddities_description());
});


//console.log(switcher.get_properties_description_by_class("videotestsrc") );
//logo.print();



// ------------------------------------ SOCKET.IO ---------------------------------------------//


io.sockets.on('connection', function (socket) {

	// socket.on("create", function(className, name, callback){
	// 	var name = switcher.create(className, name);
	// 	callback(name);
	// });
	  socket.on("create", function(className, name, callback)
	  {		
		var quiddName = switcher.create(className, name);
		callback(quiddName);
	  });
});

// merge properties of classes with ClassesDoc
function classesWithProperties(){
	var doc = $.parseJSON(switcher.get_classes_doc());
	var classesWithProperties = [];
	$.each(doc.classes, function(index, classDoc){;
		var propertyClass = $.parseJSON(switcher.get_properties_description_by_class(classDoc["class name"]));
		doc.classes[index].properties = propertyClass.properties;
	});
	return doc;
}

