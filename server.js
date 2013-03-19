var express = require("express")
, $ = require('jQuery')
, app = express()
, http = require('http')
, requirejs = require('requirejs')
, server= http.createServer(app)
, io = require('socket.io').listen(server, { log: false })
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
  response.send(quidditiesWithProperties());
});


//console.log(switcher.get_properties_description_by_class("videotestsrc") );
//logo.print();



// ------------------------------------ SOCKET.IO ---------------------------------------------//
var test = "test"
console.log(test.slice(1, -1));

io.sockets.on('connection', function (socket) {

	  socket.on("create", function(className, name, callback){		
		var quiddName = switcher.create(className);
		callback(quiddName);
	  });

	  socket.on("setPropertyValue", function(nameQuidd, property, value, callback){
	  	var ok = switcher.set_property_value(nameQuidd, property, value);
	  	callback(ok);
	  })
});

// merge properties of classes with ClassesDoc
function classesWithProperties(){
	var doc = $.parseJSON(switcher.get_classes_doc());
	var classesWithProperties = [];
	$.each(doc.classes, function(index, classDoc){;
		console.log(switcher.get_properties_description_by_class(classDoc["class name"]));
		var propertyClass = $.parseJSON(switcher.get_properties_description_by_class(classDoc["class name"])).properties;
		doc.classes[index].properties = propertyClass;
	});
	return doc;
}

function quidditiesWithProperties(){
	//recover the quiddities already existing 
	var quiddities = $.parseJSON(switcher.get_quiddities_description()).quiddities;
	//merge the properties of quiddities with quiddities
	$.each(quiddities, function(index, quidd){

		var propertiesQuidd = $.parseJSON(switcher.get_properties_description(quidd.name)).properties;
		//recover the value set for the properties
		$.each(propertiesQuidd, function(index, property){
			
			if(property.name != "shmdata-readers"){
				var valueOfproperty = switcher.get_property_value(quidd.name, property.name);
				if(property.name == "shmdata-writers"){
					
					console.log($.parseJSON(switcher.get_property_value(quidd.name, property.name)));
					//valueOfproperty = $.parseJSON(valueOfproperty);
				} 
				propertiesQuidd[index].value = valueOfproperty;
			}
		})
		quiddities[index].properties = propertiesQuidd;
	})
	return quiddities;
}

