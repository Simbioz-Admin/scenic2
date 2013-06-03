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
switcher.create("SOAPcontrolServer", "soap");
switcher.invoke("soap", "set_port", [8074]);


//create Destination
switcher.invoke("defaultrtp", "add_destination", ['bob', 'poseidon.local']);
switcher.create("SOAPcontrolClient", "soapClient-bob");
var scenicMachine = switcher.invoke("soapClient-bob", "set_remote_url", ["http://poseidon.local:8084"]);
if(!scenicMachine)
{
	console.log("soapClient-bob removed because is not necessary");
	switcher.remove("soapClient-bob");
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

switcher.invoke("defaultrtp", "add_udp_stream_to_dest", [shmdatas[0].path, "bob", '4444']);
switcher.invoke("soapClient-bob", "create", ["uridecodebin", 'video']);

setTimeout(function()
{
	switcher.invoke("soapClient-bob", "invoke1", ['video', 'to_shmdata', 'http://poseidon.local:8074/sdp?rtpsession=defaultrtp&destination=bob'])
},1000)




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
