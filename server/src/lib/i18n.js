"use strict";

var _ = require('underscore');
var i18n = require('i18next');
//var switcher = require('switcher');
var log = require('./logger');

module.exports = {
  initialize: function ( callback ) {
    log.info( "Initializing translations..." );

    i18n.init( {
      //lng: "fr",
      saveMissing:   true,
      ns:            'translation',
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

    /*function () {
      log.debug( "Parsing quiddities and properties translations..." );

      // Graying out error generated while getting properties
      process.stdout.write( '\n\u001b[90m');

      //Get names and categories from switcher
      var classDescriptions = JSON.parse( switcher.get_classes_doc() ).classes;
      _.each( classDescriptions, function ( classDoc ) {
        i18n.t( classDoc['long name'] );
        i18n.t( classDoc['category'] );
        var className = classDoc['class name'];
        try {
          console.log(className);
          var propertiesByClass = JSON.parse( switcher.get_properties_description_by_class( className ) ).properties;
          _.each( propertiesByClass, function ( prop ) {
            i18n.t( prop['long name'] );
            i18n.t( prop['short description'] );
          } );
        } catch ( e ) {

        }
      } );

      // End the graying out
      process.stdout.write('\u001b[39m\n');

      callback();
    } );*/
  }
};