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
	//console.log('...SIGNAL...: ', qname, ' ', qprop, ' ', pvalue);
});


switcher.register_prop_callback(function (qname, qprop, pvalue)
{
	console.log('...PROP...: ', qname, ' ', qprop, ' ', $.parseJSON(pvalue));
});

switcher.create("rtpsession", "defaultrtp");
switcher.create("SOAPcontrolServer", "soap");
switcher.invoke("soap", "set_port", [8074]);


var vid = switcher.create("audiotestsrc", "audio");
switcher.subscribe_to_property (vid, "shmdata-writers");

console.log("start : ", switcher.set_property_value(vid, "started", "true"));

console.log("remove",switcher.remove("vumeter"));
console.log("create : ", switcher.create("fakesink", "vumeter"));

console.log("shmdatas", $.parseJSON(switcher.get_property_value(vid, "shmdata-writers")).shmdata_writers);
console.log("connect : ", switcher.invoke("vumeter", "connect", ["/tmp/switcher_nodeserver_audio_audio"]));
console.log("subscribe", switcher.subscribe_to_property("vumeter", "byte-rate"));


console.log("start : ", switcher.set_property_value(vid, "started", "stop"));
console.log("start : ", switcher.set_property_value(vid, "started", "true"));
console.log("remove",switcher.remove("vumeter"));


console.log("create : ", switcher.create("fakesink", "vumeter"));

console.log("shmdatas", $.parseJSON(switcher.get_property_value(vid, "shmdata-writers")).shmdata_writers);
console.log("connect : ", switcher.invoke("vumeter", "connect", ["/tmp/switcher_nodeserver_audio_audio"]));
console.log("subscribe", switcher.subscribe_to_property("vumeter", "byte-rate"));


// subscribe();
// setTimeout(function() {
// 	console.log("stop : ", switcher.set_property_value(vid, "started", "false"));
// 	subscribe();
// 	setTimeout(function() {
// 		console.log("start : ", switcher.set_property_value(vid, "started", "true"));
// 		subscribe();

// // // 		// setTimeout(function() {
// // // 		// 	console.log("stop : ", switcher.set_property_value(vid, "started", "false"));
// // // 		// 	setTimeout(function() {
// // // 		// 		console.log("start :", switcher.set_property_value(vid, "started", "true"));
// // // 		// 	}, 100);
// // // 		// }, 100);
// 	}, 3000);
// }, 3000);

function subscribe() {
	var shmdatas = $.parseJSON(switcher.get_property_value(vid, "shmdata-writers")).shmdata_writers;


	if(shmdatas.length > 0) {
		console.log(shmdatas);
		$.each(shmdatas, function(index, shmdata) {

			//remove the old vumeter just in case

			//console.log("info vumeter : ", switcher.get_quiddity_description("vumeter_" + shmdata.path));
			console.log("remove vumeter : ", switcher.remove("vumeter_" + shmdata.path));
			var vumeter = switcher.create("fakesink", "vumeter_" + shmdata.path);

			if(!vumeter) { 
				console.log("info", "failed to create fakesink quiddity : ", "vumeter_" + shmdata.path);
				return false;
			} else {
				console.log("info", "fakesink quiddity created : ", "vumeter_" + shmdata.path);
			}

			var ok = switcher.invoke(vumeter, "connect", [shmdata.path]);
			var subscribe = switcher.subscribe_to_property(vumeter, "byte-rate");
			console.log("subscribe to property ", subscribe);

		});
	}
}

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
