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

switcher.get_property_description_by_class("v4l2src", "device");
//console.log(v4l2src);

var test = switcher.create("v4l2src", "test");
var test2 = switcher.get_property_description("test", "device");
console.log(test2);

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
