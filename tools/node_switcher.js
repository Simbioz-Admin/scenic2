var switcher = require('switcher');
switcher.register_log_callback(console.log);

switcher.create("SOAPcontrolServer", "soap");
switcher.invoke("soap", "set_port", [8085]);
switcher.create("sip", "SIP");
switcher.set_property_value("SIP", "port", "5060");
switcher.invoke("SIP", "register", ["1001@10.10.30.247", "1234"]);
