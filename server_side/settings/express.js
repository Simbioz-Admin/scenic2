var config = require('./config');
var express = require('express');
var i18next = require('i18next');
var path = require('path');
var nodeSwitcher = require('switcher');
var switcher = require('../switcher/switcher');
var _ = require('underscore');

// get the installation root path
var pwd = path.dirname(__dirname);
var rootPath = pwd.split('/').slice(0, -1).join('/');

var locale = require("locale");
var app = express();
var supported = ["en", "fr"];

app.use(locale(supported));
app.use(express.cookieParser());

//param necessary for access file and use authentication
//app.use(express.static(rootPath));
app.use('/bower_components', express.static(rootPath + "/bower_components"));
app.use('/client', express.static(rootPath + "/client_side"));
app.use('/locales', express.static(rootPath + "/locales"));

app.get('/', function(req, res) {

  //Define language for interface
  var lang = req.cookies.lang ;
  //if the language is not define in cookie we take the language of the system
  if(!_.contains(supported, lang)) lang = req.locale;

  i18next.setLng(lang, function(){
    res.cookie('lang',lang);
  });

  if (!config.passSet) {
    res.sendfile(rootPath + '/template.html');
  } else {
    config.passSet.apply(req, res, function(username) {
      res.sendfile(rootPath + '/template.html');
    });
  }

});

app.get('/classes_doc/:className?/:type?/:value?', function(req, res) {

  if (req.params.type == "properties") {
    if (req.params.value) res.send(JSON.parse(nodeSwitcher.get_property_description_by_class(req.params.className, req.params.value)));
    else res.send(JSON.parse(nodeSwitcher.get_properties_description_by_class(req.params.className)));
  } else if (req.params.type == "methods") {
    if (req.params.value) res.send(JSON.parse(nodeSwitcher.get_method_description_by_class(req.params.className, req.params.value)));
    else res.send(JSON.parse(nodeSwitcher.get_methods_description_by_class(req.params.className)));
  } else if (req.params.className) {
    res.send(JSON.parse(nodeSwitcher.get_class_doc(req.params.className)));
  } else {
    res.send(JSON.parse(nodeSwitcher.get_classes_doc()));
  }
});

app.get('/get_info/:quiddName/:path', function(req, res){
  var info = nodeSwitcher.get_info(req.params.quiddName, req.params.path);
  res.send(JSON.parse(info));
});

app.get('/quidds/:quiddName?/:type?/:value?/:val?', function(req, res) {
  if (req.params.val) {
    res.send(JSON.parse(nodeSwitcher.get_property_value(req.params.quiddName, req.params.value)))
  } else if (req.params.type == "properties") {
    if (req.params.value) res.send(JSON.parse(nodeSwitcher.get_property_description(req.params.quiddName, req.params.value)));
    else res.send(JSON.parse(nodeSwitcher.get_properties_description(req.params.quiddName)));
  } else if (req.params.type == "methods") {
    if (req.params.value) res.send(JSON.parse(nodeSwitcher.get_method_description(req.params.quiddName, req.params.value)));
    else res.send(JSON.parse(nodeSwitcher.get_methods_description(req.params.quiddName)));
  } else if (req.params.quiddName) {
    res.send(JSON.parse(nodeSwitcher.get_quiddity_description(req.params.quiddName)));
  } else {
    //return the quidds without the excludes
    var quidds = JSON.parse(nodeSwitcher.get_quiddities_description()).quiddities;
    var quiddsFiltered = [];
    _.each(quidds, function(quidd, index) {
      if (!_.contains(config.quiddExclude, quidd.class)) {
        var properties = switcher.quidds.get_properties_values(quidd.name);
        var methods = JSON.parse(nodeSwitcher.get_methods_description(quidd.name)).methods;
        quidds[index]["properties"] = properties;
        quidds[index]["methods"] = methods;
        quiddsFiltered.push(quidds[index]);
      }

    });

    res.send(quiddsFiltered);
  }
});


app.get('/destinationsRtp', function(request, response) {
  response.contentType('application/json');
  var destinations = nodeSwitcher.invoke("dico","read", ["destinationsRtp"]);
  response.send(destinations);

});


app.get('/destinationsProperties', function(request, response) {
  response.contentType('application/json');
  var destinations = nodeSwitcher.invoke("dico","read", ["controlProperties"]);
  response.send(destinations);

});

/* temporary create fake values for users */

app.get('/users', function(req, res) {
  res.contentType('application/json');
  var listUsers = switcher.sip.getListUsers();
  res.send(listUsers);
});

module.exports = app;