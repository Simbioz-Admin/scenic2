module.exports = function(config, _, app, io) {

  var jsonLog = [];

  //request express for get log
  app.get("/log", function(request, response) {
    response.contentType('application/json');
    response.send(jsonLog);
  });


  io.sockets.on('connection', function(socket) {
    // console.log(socket);
  });



  var log = function() {
    var levels = ['error', 'warn', 'debug', 'info'];
    if (levels.indexOf(arguments[0]) >= levels.indexOf(config.debugLevel)) {
      var message = "",
        level = arguments[0];

      for (i = 1; i < arguments.length; i++) message = message + arguments[i];
      var now = new Date()
      ,   hours = (now.getHours().toString().length == 1 ? "0" : "" )+now.getHours()
      ,   minutes = (now.getMinutes().toString().length == 1 ? "0" : "" )+now.getMinutes()
      ,   seconds = (now.getSeconds().toString().length == 1 ? "0" : "" )+now.getSeconds();
      
      //console.log(hours+":"+minutes+":"+seconds, " : "+ level, " : "+ message);

      var message = {from : "switcher", date : hours+":"+minutes+":"+seconds, level : level, message : message};
      //add to the list of log  message
      jsonLog.push(message);
      //send to the interface
      io.sockets.emit("messageLog", message);

    }
  }

  return log;
}