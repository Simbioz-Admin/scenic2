var switcher = require('switcher');
/*var quiddityManager1 = new switcher.QuiddityManager('first');
quiddityManager1.register_log_callback(function(){console.log('Quiddity Manager 1 log', arguments);});
quiddityManager1.register_prop_callback(function(){console.log('Quiddity Manager 1 prop', arguments);});
quiddityManager1.register_signal_callback(function(){console.log('Quiddity Manager 1 signal', arguments);});

var quiddityManager2 = new switcher.QuiddityManager('second');
quiddityManager2.register_log_callback(function(){console.log('Quiddity Manager 2 log', arguments);});
quiddityManager2.register_prop_callback(function(){console.log('Quiddity Manager 2 prop', arguments);});
quiddityManager2.register_signal_callback(function(){console.log('Quiddity Manager 2 signal', arguments);});*/

/*switcher.create("SOAPcontrolServer", "soap");
switcher.invoke("soap", "set_port", [8085]);
switcher.create("sip", "SIP");
switcher.set_property_value("SIP", "port", "5060");
switcher.invoke("SIP", "register", ["1001@10.10.30.247", "1234"]);*/

repl = require("repl");
r = repl.start("node> ");
r.context.s = switcher;
//r.context.q1 = quiddityManager1;
//r.context.q2 = quiddityManager2;