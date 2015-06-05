'use strict';

var _ = require('underscore');
var path = require('path');
var i18next = require('i18next');
var express = require('express');
var fs = require('fs');
var pp = require('preprocess');
var log = require('../lib/logger');

module.exports = function( app, config, serverPath ) {

    if ( process.env.NODE_ENV == 'production' ) {
        app.use( '/', express.static( serverPath + '/public' ) );
        app.use( '/locales', express.static( serverPath + '/locales' ) );
    } else {
        var rootPath = path.dirname(path.dirname(serverPath));
        log.warn('Development environment, setting express static paths accordingly...', rootPath, serverPath);
        app.use( '/bower_components', express.static( rootPath + '/bower_components' ) );
        app.use( '/', express.static( rootPath + '/client/src' ) );
        app.use( '/css', express.static( rootPath + '/client/css' ) );
        app.use( '/assets', express.static( rootPath + '/client/assets' ) );
        app.use( '/template', express.static( rootPath + '/client/template' ) );
        app.use( '/locales', express.static( rootPath + '/locales' ) );
    }

    app.get('/', function(req, res) {

        /*//Define language for interface
        var lang = req.cookies.lang ;
        //if the language is not define in cookie we take the language of the system
        if(!_.contains(config.locale.supported, lang)) lang = req.locale;

        i18next.setLng(lang, function(){
            res.cookie('lang',lang);
        });*/

        if (!config.passSet) {
            res.send(pp.preprocess(fs.readFileSync(path.join(serverPath, 'templates/index.html'))));
        } else {
            config.passSet.apply(req, res, function(username) {
                res.send(pp.preprocess(fs.readFileSync(path.join(serverPath, 'templates/index.html'))));
            });
        }

    });
};