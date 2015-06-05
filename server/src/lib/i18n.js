"use strict";

var _ = require('underscore');
var i18n = require('i18next');
var log = require('./logger');

module.exports = {
  initialize: function ( callback ) {
    log.info( "Initializing translations..." );

    i18n.init( {
      ns:            {
        namespaces: ['switcher', 'server'],
        defaultNs: 'server'
      },
      resGetPath:    'locales/__lng__/__ns__.json',
      resSetPath:    'locales/__lng__/__ns__.json',
      fallbackLng:   false,
      preload:       ['en', 'fr'],
      keyseparator:  "::",
      nsseparator:   ':::',
      debug:         false
    }, function( ) {
      callback();
    } );
  }
};