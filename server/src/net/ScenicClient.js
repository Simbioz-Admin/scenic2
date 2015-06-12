"use strict";

var _ = require('underscore');
var i18n = require( 'i18next' );
var log  = require( '../lib/logger' );

var requireDir = require('require-dir');
var commands = requireDir('commands', {recurse: true});

/**
 * Master Socket Id
 */
var masterSocketId;

/**
 * Refresh timeout
 */
var refreshTimeout;

/**
 * Constructor
 *
 * @param switcherController
 * @param config
 * @param socket
 * @constructor
 */
function ScenicClient( switcherController, config, socket ) {
    this.switcherController = switcherController;
    this.config = config;
    this.socket = socket;
    this.switcherController.bindClient( socket );
    this.bindCommands( commands );
}

/**
 * Binds a list of command modules to the socket instance
 *
 * @param {Array} commands - List of command modules
 */
ScenicClient.prototype.bindCommands = function( commands ) {
    // Bind commands to client socket
    _.each( commands, function( command, key ) {
        var fn;
        if ( command.execute && _.isFunction(command.execute)) {
            fn = command.execute;
        } else if ( _.isFunction(command)) {
            fn = command;
        }
        if ( fn ) {
            this.socket.on( command.name ? command.name : key, fn.bind( this ) );
        }
    }, this );
};

/**
 * Get the master socket id
 *
 * @getter
 * @static ish
 * @returns {String} - The master socket id, if any
 */
ScenicClient.prototype.getMasterSocketId = function() {
    return masterSocketId;
};

/**
 * Set the master socket id
 *
 * @setter
 * @static ish
 * @param {String} socketId - The master socket id
 */
ScenicClient.prototype.setMasterSocketId = function( socketId ) {
    masterSocketId = socketId;
};

/**
 * Set the static refresh timeout
 *
 * @param timeout
 */
ScenicClient.prototype.setRefreshTimeout = function( timeout ) {
    refreshTimeout = timeout;
};

/**
 * Get the static refresh timeout
 *
 * @return timeout
 */
ScenicClient.prototype.getRefreshTimeout = function() {
    return refreshTimeout;
};

module.exports = ScenicClient;