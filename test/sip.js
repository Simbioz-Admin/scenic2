var express = require('express')
,	app = express()
,	$ = require("jquery")
,	server = app.listen(5001)
,   switcher = require("/usr/local/lib/nodejs/switcher.node");

server.listen(3000);


switcher.register_log_callback(function (msg)
{
	////console.log('log : ', msg);
});

switcher.register_signal_callback(function (qname, qprop, pvalue){
	//console.log('...SIGNAL...: ', qname, ' ', qprop, ' ', pvalue);
});


switcher.register_prop_callback(function (qname, qprop, pvalue)
{
	//console.log('...PROP...: ', qname, ' ', qprop, ' ', $.parseJSON(pvalue));
});

switcher.create("rtpsession", "defaultrtp");
switcher.create("SOAPcontrolServer", "soap");
switcher.invoke("soap", "set_port", [8074]);

var quiddSipName = "sipQuidd";
console.log('1. Create quiddity SIP');
switcher.create("sip", quiddSipName);
if (!quiddSipName) console.log("Error  create Quiddity sip");


console.log('2. Register user pachesnel');
var register = switcher.invoke(quiddSipName, "register", ["pachesnel@scenic.sat.qc.ca","test" ]);

console.log('3. Unregister SIP server');
var unregister =  switcher.invoke(quiddSipName, "unregister", []);

console.log('4. Remove quiddity SIP');
var removeQuidity = switcher.remove(quiddSipName);
if(!removeQuidity) console.log('ERROR : Remove quiddity SIP');

console.log('5. Re-create quiddity SIP');
quiddSipName = switcher.create("sip", quiddSipName);
if (!quiddSipName) console.log("ERROR : re-create Quiddity sip");


return;


/* subscribe to the modification on this quiddity */
switcher.subscribe_to_signal(quiddSipName, "on-tree-grafted");
switcher.subscribe_to_signal(quiddSipName, "on-tree-pruned");

var register = switcher.invoke(quiddSipName, "register", ["pachesnel@scenic.sat.qc.ca","test" ]);
//console.log("Register sip", register);


var usersDico = switcher.create( "dico", "users");
//console.log("Create dico Users", usersDico);


/* Load from files users */
var file = "users.json";
var loadUsers = switcher.invoke("users", "load", [process.env.HOME + "/.scenic/save_files/"+file]);

console.log("loadUsers",loadUsers);

//console.log("newEntry", newEntry);


var newUser = "1001@scenic.sat.qc.ca";
var name = "user1";

var newEntry = switcher.invoke("users", "new-entry", [newUser, "", ""]);
switcher.set_property_value("users", newUser, name);

var addBud1 = switcher.invoke(quiddSipName, "add_buddy", [newUser]);
//console.log("Add buddy 1001", addBud1);

var users = [
	{name : "1001", nickname : "user1"},
	{name : "1002", nickname : "user2"},
]



//var setPropertyUsers = switcher.set_property_value("users", "list-users", JSON.stringify(users));

var saveUsers = switcher.invoke("users", "save", [process.env.HOME + "/.scenic/save_files/"+file]);

//console.log("setPropertyUsers", setPropertyUsers);
console.log("properties", switcher.get_properties_description("users"));




//please quit switcher properly
process.on('exit', function () {
	switcher.close();

	//io.sockets.emit("shutdown", "bang");
	//console.log('About to exit.');
});
process.on('SIGINT', function () {
	switcher.close();
	//console.log('Got SIGINT.  About to exit.');
	process.exit(0);
});
