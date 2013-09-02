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

var dico = switcher.create("dico", "dico");

var methods = switcher.invoke(dico, "new-entry", ["remoteProperties", "stock informations about properties controlable by controlers (midi, osc, etc..)", "Properties of Quidds for Controls"]);
console.log("created remoteProperties", methods);
console.log("Get properties of dico :", switcher.get_property_description(dico, "remoteProperties"));

var json = { name : "videotest_freq", quiddName : "videotest", property : "freq" };

console.log("set property of remoteProperties :", switcher.set_property_value(dico, "remoteProperties", JSON.stringify(json)));

console.log("show value of remoteProperties :");
var jsonBack = switcher.get_property_value(dico, "remoteProperties");
console.log($.parseJSON(jsonBack));

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
