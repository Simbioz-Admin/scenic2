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

switcher.register_signal_callback(function (qname, qprop, pvalue){
	console.log('...SIGNAL...: ', qname, ' ', qprop, ' ', pvalue);
});


switcher.register_prop_callback(function (qname, qprop, pvalue)
{
	console.log('...PROP...: ', qname, ' ', qprop, ' ', $.parseJSON(pvalue));
});

switcher.create("rtpsession", "defaultrtp");
switcher.create("SOAPcontrolServer", "soap");
switcher.invoke("soap", "set_port", [8074]);



var midi = switcher.create("midisrc", "midi");
var audio = switcher.create("audiotestsrc", "audio");

var listen = switcher.create("pulsesink", "audio-listen");




console.log("set device : ", switcher.set_property_value(midi, "device", "3"));
console.log("start midi : ",switcher.set_property_value(midi, "started", "true"));
console.log("start audio : ",switcher.set_property_value(audio, "started", "true"));


var test = switcher.get_properties_description(midi);
	if(test == "") console.log("NO!");
	
setTimeout(function()
{
	console.log("set Touch", switcher.invoke(midi, "last_midi_event_to_property", ["touch1"]));
	console.log("get properties : ", switcher.get_properties_description(midi));

	//set mapper quidd
	var mapper = switcher.create("property-mapper");
	console.log("set quiddity mapper source", switcher.invoke(mapper, "set-source-property", [midi, "159_60"]));
	console.log("set quiddity mapper sink", switcher.invoke(mapper, "set-sink-property", [audio, "freq"]));
	

	//listen audio and play with touch1
	var shmdata_audio = $.parseJSON(switcher.get_property_value(audio, "shmdata-writers")).shmdata_writers[0].path;
	switcher.invoke(listen, "connect", [shmdata_audio]);


},2000);





// console.log("1", v4l2src);


// var properties = $.parseJSON(switcher.get_property_value(v4l2src, "devices-json"));
// console.log(switcher.get_methods_description(v4l2src))
// //console.log(properties["capture devices"]);

// var test = switcher.invoke(v4l2src, "capture_full", ["/dev/video0", 640, 480, 30, 1, "default"]);
// console.log(test);



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
