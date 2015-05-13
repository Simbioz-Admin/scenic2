"use strict";

var portastic = require('portastic');
var log = require('../lib/logger');

module.exports = function( name, config, callback ) {
    if ( config.port ) {
        // Sanity check
        if (typeof config.port != "number" && config.port.toString().length < 4) {
            return callback( 'Invalid ' + name + ' port: ' + config.port );
        }
        // Port test
        portastic.test( config.port, function( err, data ) {
            if (err) {
                return callback(err);
            }
            if (!data) {
                return callback( name + ' port ' + config.port + ' isn\'t available' );
            }
            callback( null, config.port );
        } );
    } else {
        // Find port
        log.debug( 'Autodetecting ' + name + ' port number...' );
        portastic.find( config.ports, function( err, data ) {
            if (err) {
                return callback(err);
            }
            if (!data) {
                return callback( 'No available ' + name + ' port found in the range ' + config.min + '-' + config.max );
            }
            config.port = data;
            callback( null, config.port );
        } );
    }
}