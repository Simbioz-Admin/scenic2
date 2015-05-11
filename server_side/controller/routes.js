"use strict";

var _ = require('underscore');
var path = require('path');
var i18next = require('i18next');
var express = require('express');
var switcher = require('switcher');
var switcherControl = require('../switcher/switcher-control');

module.exports = function( app, config ) {

    var pwd = path.dirname(__dirname);
    var rootPath = pwd.split('/').slice(0, -1).join('/');

    app.use('/bower_components', express.static(rootPath + "/bower_components"));
    app.use('/client', express.static(rootPath + "/client_side"));
    app.use('/locales', express.static(rootPath + "/locales"));

    app.get('/', function(req, res) {

        //Define language for interface
        var lang = req.cookies.lang ;
        //if the language is not define in cookie we take the language of the system
        if(!_.contains(config.locale.supported, lang)) lang = req.locale;

        i18next.setLng(lang, function(){
            res.cookie('lang',lang);
        });

        if (!config.passSet) {
            res.sendfile(rootPath + '/server_side/templates/index.html');
        } else {
            config.passSet.apply(req, res, function(username) {
                res.sendfile(rootPath + '/server_side/templates/index.html');
            });
        }

    });

    app.get('/classes_doc/:className?/:type?/:value?', function(req, res) {

        if (req.params.type == "properties") {
            if (req.params.value) res.send(JSON.parse(switcher.get_property_description_by_class(req.params.className, req.params.value)));
            else res.send(JSON.parse(switcher.get_properties_description_by_class(req.params.className)));
        } else if (req.params.type == "methods") {
            if (req.params.value) res.send(JSON.parse(switcher.get_method_description_by_class(req.params.className, req.params.value)));
            else res.send(JSON.parse(switcher.get_methods_description_by_class(req.params.className)));
        } else if (req.params.className) {
            res.send(JSON.parse(switcher.get_class_doc(req.params.className)));
        } else {
            res.send(JSON.parse(switcher.get_classes_doc()));
        }
    });

    app.get('/get_info/:quiddName/:path', function(req, res){
        var info = switcher.get_info(req.params.quiddName, req.params.path);
        res.send(JSON.parse(info));
    });

    app.get('/quidds/:quiddName?/:type?/:value?/:val?', function(req, res) {
        if (req.params.val) {
            res.send(JSON.parse(switcher.get_property_value(req.params.quiddName, req.params.value)))
        } else if (req.params.type == "properties") {
            if (req.params.value) res.send(JSON.parse(switcher.get_property_description(req.params.quiddName, req.params.value)));
            else res.send(JSON.parse(switcher.get_properties_description(req.params.quiddName)));
        } else if (req.params.type == "methods") {
            if (req.params.value) res.send(JSON.parse(switcher.get_method_description(req.params.quiddName, req.params.value)));
            else res.send(JSON.parse(switcher.get_methods_description(req.params.quiddName)));
        } else if (req.params.quiddName) {
            res.send(JSON.parse(switcher.get_quiddity_description(req.params.quiddName)));
        } else {
            //return the quidds without the excludes
            var quidds = JSON.parse(switcher.get_quiddities_description()).quiddities;
            var quiddsFiltered = [];
            _.each(quidds, function(quidd, index) {
                if (!_.contains(config.quiddExclude, quidd.class)) {
                    var properties = switcherControl.quidds.get_properties_values(quidd.name);
                    var methods = JSON.parse(switcher.get_methods_description(quidd.name)).methods;
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
        var destinations = switcher.invoke("dico","read", ["destinationsRtp"]);
        response.send(destinations);
    });


    app.get('/destinationsProperties', function(request, response) {
        response.contentType('application/json');
        var destinations = switcher.invoke("dico","read", ["controlProperties"]);
        response.send(destinations);
    });

    /* temporary create fake values for users */

    app.get('/users', function(req, res) {
        res.contentType('application/json');
        var listUsers = switcherControl.sip.getListUsers();
        res.send(listUsers);
    });
};