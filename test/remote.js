var express = require('express')
,	app = express()
,	$ = require("jquery")
,	server = app.listen(5001)
,   switcher = require("node-switcher");

server.listen(3000);


switcher.register_log_callback(function (msg)
{
	//console.log('log : ', msg);
});



switcher.create("rtpsession", "defaultrtp");


//create Destination
switcher.invoke("defaultrtp", "add_destination", ['poseidon', 'poseidon.local']);
switcher.create("SOAPcontrolClient", "soapClient-poseidon");
var scenicMachine = switcher.invoke("soapClient-poseidon", "set_remote_url", ["http://localhost:8084"]);
if(!scenicMachine)
{
	console.log("soapClient-poseidon removed because is not necessary");
	switcher.remove("soapClient-poseidon");
}

//*** Create quiddity and add shmdata to the defaultrtp ***///

var qname = switcher.create("videotestsrc", "video");
var shmdatas = $.parseJSON(switcher.get_property_value(qname, "shmdata-writers")).shmdata_writers;
$.each(shmdatas, function(index, shmdata)
{
	console.log("add shmdata "+shmdata.path);
	switcher.invoke("defaultrtp", "add_data_stream", [shmdata.path]);
});


//**create connection between shmdata and destination

switcher.invoke("defaultrtp", "add_udp_stream_to_dest", [shmdatas[0].path, "poseidon", '4444']);
switcher.invoke("soapClient-poseidon", "create", ["uridecodebin", 'video']);
console.log(shmdatas[0].path);
var test = switcher.invoke("soapClient-poseidon", "invoke1", ['video', 'to_shmdata', shmdatas[0].path])
console.log("test", test);



// var ok = switcher.invoke("soapClient", "set_remote_url", ["http://localhost:8084"]);
// switcher.invoke("soapClient", "create", ["audiotestsrc", 'audio2']);


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
