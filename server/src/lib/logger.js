"use strict";

var winston = require('winston');
var colors = require('colors/safe');
var config = require('../settings/config');

var customLevels = {
  levels: {
    verbose: 0,
    switcher: 1,
    debug: 2,
    info: 3,
    warn: 4,
    error: 5
  },
  colors: {
    verbose: 'gray',
    switcher: 'magenta',
    debug: 'gray',
    info: 'blue',
    warn: 'yellow',
    error: 'red'
  }
};

/* check if folder logs exist */
var fs = require('fs');

if (!fs.existsSync(config.pathLogs)) {
  // create folder
  fs.mkdir(config.pathLogs, function(e) {
    if (e) return console.log(e);
  })
}

var log = new(winston.Logger)({
  levels: customLevels.levels,
  transports: [
    new(winston.transports.Console)({
      colorize: true,
      prettyPrint: true,
      level: config.logLevel
    }),
    new(winston.transports.File)({
      filename: config.pathLogs + 'logging-file.log',
      prettyPrint: true,
      level: 'error'
    })
  ]
});

// Add line numbers to errors
log.addFilter( function(msg, meta, level) {
  if ( level == 'error' ) {
    if ( meta && meta.logback ) {
      msg = traceCaller( 6 ) + ": " + msg;
      delete meta.logback;
    } else {
      msg = traceCaller( 5 ) + ": " + msg;
    }
  } else if ( level == 'switcher' ) {
    var prefix = msg.split(':')[0];
    switch( prefix.split('-' ).pop() ) {
      case 'erorr':
        msg = colors.red( msg );
        break;
      case 'warn':
      case 'warning':
        msg = colors.yellow( msg );
        break;
      case 'info':
        msg = colors.blue( msg );
        break;
      case 'message':
      case 'notice':
      case 'log':
        //noop
        break;
      case 'debug':
        msg = colors.gray( msg );
        break;
    }
  }
  return { msg: msg, meta: meta, level: level };
});

winston.addColors(customLevels.colors);

/**
 * examines the call stack and returns a string indicating
 * the file and line number of the n'th previous ancestor call.
 * this works in chrome, and should work in nodejs as well.
 *
 * @param n : int (default: n=1) - the number of calls to trace up the
 *   stack from the current call.  `n=0` gives you your current file/line.
 *  `n=1` gives the file/line that called you.
 */

function traceCaller(n) {
  if (isNaN(n) || n < 0) n = 1;
  n += 1;
  var s = (new Error()).stack,
      a = s.indexOf('\n', 5);
  while (n--) {
    a = s.indexOf('\n', a + 1);
    if (a < 0) {
      a = s.lastIndexOf('\n', s.length);
      break;
    }
  }
  var b = s.indexOf('\n', a + 1);
  if (b < 0) b = s.length;
  a = Math.max(s.lastIndexOf(' ', b), s.lastIndexOf('/', b));
  b = s.lastIndexOf(':', b);
  s = s.substring(a + 1, b);
  return s;
}

module.exports = log;
