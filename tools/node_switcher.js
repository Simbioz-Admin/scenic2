var switcher = require('switcher');

repl = require("repl");
r = repl.start("node> ");
r.context.switcher = switcher;