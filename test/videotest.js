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
	console.log('...PROP...: ', qname, ' ', qprop, ' ', pvalue);
});

switcher.create("rtpsession", "defaultrtp");
switcher.create("SOAPcontrolServer", "soap");
switcher.invoke("soap", "set_port", [8074]);


var vid = switcher.create("videotestsrc", "vid");
console.log(switcher.set_property_value(vid, "started", "true"));
console.log(switcher.subscribe_to_property(vid, "pattern"));
console.log(switcher.set_property_value(vid, "pattern", "3"));

// //recover the value set for the properties
// $.each(propertiesQuidd, function(index, property) {
// 	console.log("get value of property : ", property.name);
// 	//if(property.name == "codec") {
// 		var valueOfproperty = switcher.get_property_value(vid, property.name);
// 		console.log("get property_value", valueOfproperty);
// 	//}
// 	// if (property.name == "shmdata-writers") valueOfproperty = $.parseJSON(valueOfproperty);
// 	// propertiesQuidd[index].value = valueOfproperty;
// });



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
