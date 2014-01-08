module.exports = function(config, _, app, io, $) {


  var winston = require('winston');

  var log = new(winston.Logger)({
    transports: [
      new(winston.transports.Console)({
        'colorize': true,
        level : config.logLevel
      }),
      new(winston.transports.File)({
        filename: 'logging-file.log'
      })
    ]
  });


  var logger_info_old = log.error;

  log.error = function(msg) {
    var fileAndLine = traceCaller(1);
    return logger_info_old.call(this, fileAndLine + ":" + msg);
  }

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
    b = s.indexOf('\n', a + 1);
    if (b < 0) b = s.length;
    a = Math.max(s.lastIndexOf(' ', b), s.lastIndexOf('/', b));
    b = s.lastIndexOf(':', b);
    s = s.substring(a + 1, b);
    return s;
  }

  return log;

  // var jsonLog = [];

  // //request express for get log
  // app.get("/log", function(request, response) {
  //   response.contentType('application/json');
  //   response.send(jsonLog);
  // });


  // io.sockets.on('connection', function(socket) {
  //   // console.log(socket);
  // });



  // var log = function() {
  //   var levels = ['error', 'warn', 'debug', 'info'];
  //   if (levels.indexOf(arguments[0]) >= levels.indexOf(config.debugLevel)) {
  //     var message = "",
  //       level = arguments[0];

  //     for (i = 1; i < arguments.length; i++) message = message + arguments[i];
  //     var now = new Date()
  //     ,   hours = (now.getHours().toString().length == 1 ? "0" : "" )+now.getHours()
  //     ,   minutes = (now.getMinutes().toString().length == 1 ? "0" : "" )+now.getMinutes()
  //     ,   seconds = (now.getSeconds().toString().length == 1 ? "0" : "" )+now.getSeconds();


  //     var message = {from : "switcher", date : hours+":"+minutes+":"+seconds, level : level, message : message};
  //     //add to the list of log  message
  //     if(level == "error") {
  //       console.log(hours+":"+minutes+":"+seconds, " : "+ level, " : "+ $.parseJSON(message));
  //     }

  //     if(level == "info" || level == "error") {
  //       // console.log(hours+":"+minutes+":"+seconds, " : "+ level, " : "+ message);
  //       jsonLog.push(message);
  //       io.sockets.emit("messageLog", message);
  //     }
  //     //send to the interface

  //   }
  // }

  // return log;
}