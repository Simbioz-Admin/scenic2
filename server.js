var express = require("express")
, $ = require('jQuery')
, app = express()
, http = require('http')
, requirejs = require('requirejs')
, server= http.createServer(app)
, io = require('socket.io').listen(server, { log: false })
, logo = require('./js/libs/logo.js')
, switcher = require('node-switcher')
, child_process = require('child_process')
, readline = require('readline')
, passport = require('passport')
, DigestStrategy = require('passport-http').DigestStrategy
, irc = require('irc');

server.listen(8085);

app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));
app.use(express.bodyParser());

// configure Express
app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});



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

function puts(error, stdout, stderr) { sys.puts(stdout) }

// ------------------------------------ AUTHENTIFICATION ---------------------------------------------//

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



process.stdin.on('keypress', function(s, key){
	    process.stdout.write('\u001B[0D\u001B[2K');
	
});
  

var pass = false;

process.argv.forEach(function (val, index, array)
{
  if(val == "--p") pass = true;
});

if(pass)
{
	rl.question("choose a password : \n", function(password) {
	  // TODO: Log the answer in a database

	console.log("Thank for the password!");
	require("./auth.js")(app, express, passport, DigestStrategy, password);
	  rl.close();
	});

} 
else
{
	app.get('/', function (req, res){
		  res.sendfile(__dirname + '/index.html');
	});
}





// ------------------------------------ WEB APP ---------------------------------------------//


// app.get('/classes_doc', function(request, response) {
//   response.contentType('application/json');
//   response.send(getClassesDocWithProperties());
// });

app.get('/classes_doc/:className?/:type?/:value?', function(req, res){

	if(req.params.type == "properties")
	{
		if(req.params.value) 	res.send(get_property_description_by_class(req.params.className, req.params.value));
		else 					res.send(get_properties_description_by_class(req.params.className));
	}
	else if(req.params.type == "methods")
	{
		if(req.params.value)	res.send(get_method_description_by_class(req.params.className, req.params.value));
		else					res.send(get_methods_description_by_class(req.params.className));
	}
	else if(req.params.className)
	{
		res.send(get_class_doc(req.params.className));
	}
	else
	{
		if(req.query.category) res.send(get_classes_docs_type(req.query.category));
		else res.send(get_classes_docs());
	}
});



app.get('/quidds/:quiddName?/:type?/:value?', function(req, res)
{
	if(req.params.type == "properties")
	{
		if(req.params.value)	res.send(get_property_description(req.params.quiddName, req.params.value))
		else					res.send(get_properties_description(req.params.quiddName));
  	}
	else if(req.params.type == "methods")
	{
		if(req.params.value)	res.send(get_method_description(req.params.quiddName, req.params.value));
		else					res.send(get_methods_description(req.params.quiddName));
	}
  	else if(req.params.quiddName)
  	{
		res.send(get_quiddity_description(req.params.quiddName));
  	}
  	else
  	{
		res.send(getQuidds());
  	}
});



// app.get('/classes_doc/:className', function(req, res){
// 	console.log(req.query);
// 	res.send(get_class_doc(req.params.className));
// });


app.get('/methods_doc', function(request, response) {
  response.contentType('application/json');
  response.send(getQuidditiesWithMethods());
});



app.get('/shmdatas', function(request, response) {
  response.contentType('application/json');
  response.send(getShmdatas());
});

app.get('/destinations', function(request, response) {
  response.contentType('application/json');
  response.send(switcher.get_property_value("defaultrtp", "destinations-json"));
});


//console.log(switcher.get_properties_description_by_class("videotestsrc") );
//logo.print();

switcher.register_log_callback(function (msg){
		//io.sockets.emit("messageLog", msg);
		//console.log('.....log message: ', msg);
 });

switcher.register_prop_callback(function (qname, qprop, pvalue){
	console.log('...PROP...: ', qname, ' ', qprop, ' ', pvalue);
});

switcher.create("rtpsession", "defaultrtp");

switcher.create("videotestsrc", "video");
switcher.invoke("defaultrtp", "add_destination", ["pacman", "poseidon.local"]);

switcher.create("SOAPcontrolServer", "soap");
switcher.invoke("soap", "set_port", ["8084"]);

//console.log(switcher.invoke("defaultrtp", "add_udp_stream_to_dest", ["Nico", "/tmp/switcher_nodeserver_audiotestsrc10_audio", "8585"]));
//

// ------------------------------------ SOCKET.IO ---------------------------------------------//

io.sockets.on('connection', function (socket) {


	// ------------------------------------ IRC-CHAT ---------------------------------------------//

	require("./irc.js")(io, socket, irc);


	socket.on("create", function(className, name, callback)
	{        
		var quiddName = switcher.create(className, name);
		//recover the default properties with values
		var properties = getQuiddPropertiesWithValues(quiddName)
		//callback is used by the user who has created the Quidd for directly set properties 
		callback({ name : quiddName, class : className, properties : properties});
		console.log(className, name);
		io.sockets.emit("create", { name : quiddName, class : className, properties : properties});
	});


	socket.on("remove", function(quiddName){
		console.log(quiddName);
		var quiddDelete = switcher.remove(quiddName);

		io.sockets.emit("remove", quiddName);
	});


	socket.on("setPropertyValue", function(quiddName, property, value, callback){
		var ok = switcher.set_property_value(quiddName, property, value);
		callback(ok);
		io.sockets.emit("setPropertyValue", quiddName, property, value);
	});


	socket.on("getMethodDescription", function(quiddName, method, callback){
		var descriptionJson = $.parseJSON(switcher.get_method_description(quiddName, method));
		callback(descriptionJson);
	});


	socket.on("getMethodsDescriptionByClass", function(quiddName, callback){
		var methodsDescriptionByClass = $.parseJSON(switcher.get_methods_description_by_class(quiddName)).methods;
		callback(methodsDescriptionByClass);
	});


	socket.on("invoke", function(quiddName, method, parameters, callback){
		var invoke = switcher.invoke(quiddName, method, parameters);
		callback(invoke);
		io.sockets.emit("invoke", invoke, quiddName, method, parameters);
	});


	socket.on("getPropertiesOfClass", function(className, callback){
		var propertiesofClass = $.parseJSON(switcher.get_properties_description_by_class(className)).properties;
		callback(propertiesofClass);
	});


	socket.on("getPropertiesOfQuidd", function(quiddName, callback){
		var propertiesOfQuidd = getQuiddPropertiesWithValues(quiddName);
		callback(propertiesOfQuidd);
	});


	socket.on("getQuidditiesWithPropertiesAndValues", function(quiddName, callback){
		var QuidditiesWithPropertiesAndValues = getQuidditiesWithPropertiesAndValues(quiddName);
		callback(QuidditiesWithPropertiesAndValues);
	});

	socket.on("get_property_value", function(quiddName, property, callback){
		var quidds = $.parseJSON(switcher.get_property_value(quiddName, property));
		callback(quidds);
	});


});

function getQuidds(){
	var quidds =  $.parseJSON(switcher.get_quiddities_description()).quiddities;
	return quidds;
}

function get_classes_docs(){
	var docs = $.parseJSON(switcher.get_classes_doc());
	return docs;
}

function get_classes_docs_type(type){
	var docsType = { classes : []};
	var docs = get_classes_docs();
	$.each(docs.classes, function(index, doc)
	{
		if(doc["category"].indexOf(type) > -1) docsType.classes.push(doc);
	});
	return docsType;
}

function get_class_doc(className){
	var doc = $.parseJSON(switcher.get_class_doc(className));
	return doc;
}

function get_properties_description_by_class(nameClass){
	var properties = $.parseJSON(switcher.get_properties_description_by_class(nameClass));
	return properties;
}

function get_property_description_by_class(nameClass, property){
	var properties = $.parseJSON(switcher.get_property_description_by_class(nameClass, property));
	return properties;
}

function get_property_value(nameClass, property){
	var property = $.parse.JSON(switcher.get_property_value(nameClass, property));
	return property;
}

function get_methods_description_by_class(nameClass){
	var methods = $.parseJSON(switcher.get_methods_description_by_class(nameClass));
	return methods;
}

function get_method_description_by_class(nameClass, method){
	var method = $.parseJSON(switcher.get_method_description_by_class(nameClass, method));
	return method;
}

function get_quiddity_description(nameQuidd){
	var quidd = $.parseJSON(switcher.get_quiddity_description(nameQuidd));
	return quidd;
}

function get_properties_description(nameQuidd){
	var properties = $.parseJSON(switcher.get_properties_description(nameQuidd));
	return properties
}

function get_property_description(nameQuidd, property){
	var property = $.parseJSON(switcher.get_property_description(nameQuidd, property));
	return property
}

function get_methods_description(nameQuidd){
	console.log(nameQuidd);
	var methods = $.parseJSON(switcher.get_methods_description(nameQuidd));
	return methods
}

function get_method_description(nameQuidd, method){
	var method = $.parseJSON(switcher.get_method_description(nameQuidd, method));
	return method
}

// merge properties of classes with ClassesDoc
function getClassesDocWithProperties(){
	var docs = $.parseJSON(switcher.get_classes_doc());
	$.each(docs.classes, function(index, classDoc){;
		var propertyClass = $.parseJSON(switcher.get_properties_description_by_class(classDoc["class name"])).properties;
		docs.classes[index].properties = propertyClass;
	});
	return docs;
}


function getQuidditiesWithMethods(){
	var docs = $.parseJSON(switcher.get_classes_doc());
	$.each(docs.classes, function(index, classDoc){;
		if(classDoc["class name"] != "logger"){
			var propertyClass = $.parseJSON(switcher.get_methods_description_by_class(classDoc["class name"])).methods;
		}

		docs.classes[index].methods = propertyClass;
	});
	return docs;
}


function getQuidditiesWithPropertiesAndValues(){
	//recover the quiddities already existing 
	var quiddities = $.parseJSON(switcher.get_quiddities_description()).quiddities;
	//merge the properties of quiddities with quiddities
	$.each(quiddities, function(index, quidd){      
		quiddities[index].properties = getQuiddPropertiesWithValues(quidd.name);
	})
	return quiddities;
}


function getQuiddPropertiesWithValues(quiddName){
	var propertiesQuidd = $.parseJSON(switcher.get_properties_description(quiddName)).properties;
	//recover the value set for the properties
	$.each(propertiesQuidd, function(index, property){
		
		var valueOfproperty = switcher.get_property_value(quiddName, property.name);
		if(property.name == "shmdata-writers"){ 
			valueOfproperty = $.parseJSON(valueOfproperty);
		} 
		propertiesQuidd[index].value = valueOfproperty;
		
	})
	return  propertiesQuidd;
}

function getShmdatas(){
	var shmdatas = [];
	var quiddities = $.parseJSON(switcher.get_quiddities_description()).quiddities;
	//merge the properties of quiddities with quiddities
	$.each(quiddities, function(index, quidd){
		var shmdata = switcher.get_property_value(quidd.name, "shmdata-writers");
		if(shmdata != "property not found" ){
			var shmdataJson = $.parseJSON(shmdata);
			if(shmdataJson.shmdata_writers.length > 0 && quidd.class != "gstvideosrc"){
				shmdatas.push({"quiddName" : quidd.name, "paths" : shmdataJson.shmdata_writers});
			}
		}
	})
	return shmdatas;
}

