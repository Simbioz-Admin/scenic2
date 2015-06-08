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

    // Bind commands to client socket
    _.each( commands, function( command, key ) {
        var fn;
        if ( command.execute && _.isFunction(command.execute)) {
            fn = command.execute;
        } else if ( _.isFunction(command)) {
            fn = command;
        }
        if ( fn ) {
            socket.on( command.name ? command.name : key, fn.bind( this ) );
        }
    }, this );

    // Connection
    //socket.on( 'getConfig', this._onGetConfig.bind( this ) );
    socket.on( 'disconnect', this._onDisconnect.bind( this ) );

    // General
    /*socket.on( "getFiles", this._onGetFiles.bind( this ) );
    socket.on( "loadFile", this._onLoadFile.bind( this ) );
    socket.on( "saveFile", this._onSaveFile.bind( this ) );
    socket.on( "deleteFile", this._onDeleteFile.bind( this ) );*/

    // Quiddities
    /*socket.on( 'create', this._onCreate.bind( this ) );
    socket.on( 'remove', this._onRemove.bind( this ) );
    socket.on( 'getQuiddityClasses', this._onGetQuiddityClasses.bind( this ) );
    socket.on( 'getQuiddities', this._onGetQuiddities.bind( this ) );
    socket.on( 'getTreeInfo', this._onGetTreeInfo.bind( this ) );
    socket.on( 'getProperties', this._onGetProperties.bind( this ) );
    socket.on( 'getPropertyDescription', this._onGetPropertyDescription.bind( this ) );
    socket.on( 'setPropertyValue', this._onSetPropertyValue.bind( this ) );
    socket.on( 'getMethods', this._onGetMethods.bind( this ) );
    socket.on( 'getMethodDescription', this._onGetMethodDescription.bind( this ) );
    socket.on( 'invokeMethod', this._onInvokeMethod.bind( this ) );*/

    // SIP
    /*socket.on( 'sipLogin', this._onSipLogin.bind( this ) );
    socket.on( 'sipLogout', this._onSipLogout.bind( this ) );
    socket.on( 'getContacts', this._onGetContacts.bind( this ) );
    socket.on( 'addContact', this._onAddContact.bind( this ) );
    socket.on( 'removeContact', this._onRemoveContact.bind( this ) );
    socket.on( 'updateContact', this._onUpdateContact.bind( this ) );
    socket.on( 'attachShmdataToContact', this._onAttachShmdataToContact.bind( this ) );
    socket.on( 'detachShmdataFromContact', this._onDetachShmdataFromContact.bind( this ) );
    socket.on( 'callContact', this._onCallContact.bind( this ) );
    socket.on( 'hangUpContact', this._onHangUpContact.bind( this ) );*/

    // RTP
    /*socket.on( "createRTPDestination", this._onCreateRTPDestination.bind( this ) );
    socket.on( "removeRTPDestination", this._onRemoveRTPDestination.bind( this ) );
    socket.on( "connectRTPDestination", this._onConnectRTPDestination.bind( this ) );
    socket.on( "disconnectRTPDestination", this._onDisconnectRTPDestination.bind( this ) );
    socket.on( "updateRTPDestination", this._onUpdateRTPDestination.bind( this ) );*/
}

ScenicClient.prototype.bindCommands = function() {

};

/**
 * Get config handler
 * Called at the very start of the client initialization to retrieve the configuration
 *
 * @param oldSocketId
 * @param newSocketId
 * @param cb
 * @private
 */
/*ScenicClient.prototype._onGetConfig = function ( oldSocketId, newSocketId, cb ) {
    if ( masterSocketId && oldSocketId == masterSocketId ) {
        clearTimeout( this.refreshTimeout );
        masterSocketId = newSocketId;
    } else if ( !masterSocketId ) {
        log.debug( "Master socket id: ", this.socket.id );
        masterSocketId = this.socket.id;
    }
    //TODO: Only return the part actually useful for the client
    cb( this.config)
};*/

/**
 * Disconnect handler
 *
 * @private
 */
ScenicClient.prototype._onDisconnect = function () {
    //TODO: Unbind client and remove all traces of it

    //If the user disconnecting is the "master" user, we set a timeout before exiting the application
    if ( masterSocketId == this.socket.id && this.config.standalone == false ) {
        this.refreshTimeout = setTimeout( function () {
            //TODO: Maybe don't be that violent about it, we could notify higher up and let the app decide
            log.info( 'Last window closed, exiting...' );
            process.exit();
        }, 2000 );
    }
};

module.exports = ScenicClient;