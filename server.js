var express = require("express")
, $ = require('jQuery')
, app = express()
, http = require('http')
, requirejs = require('requirejs')
, server= http.createServer(app)
, io = require('socket.io').listen(server, { log: true })
, logo = require('./js/libs/logo.js');

server.listen(8085);

app.use("/assets", express.static(__dirname + "/assets"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/templates", express.static(__dirname + "/templates"));

// ------------------------------------ WEB APP ---------------------------------------------//

// routing

app.get('/', function (req, res){
  res.sendfile(__dirname + '/index.html');
});

//logo.print();


