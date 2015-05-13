"use strict";

var _         = require( 'underscore' );
var i18n      = require( 'i18next' );
var cryptoJS  = require( 'crypto-js' );
var log       = require( '../lib/logger' );
var checkPort = require( '../utils/check-port' );

var secretString = 'Les patates sont douces!';

/**
 * Constructor
 *
 * @param config
 * @param switcher
 * @param io
 * @constructor
 */
function SipManager( config, switcher, io ) {
    this.config    = config;
    this.switcher  = switcher;
    this.io        = io;
}

/**
 * Binds a new client socket
 *
 * @param socket
 */
SipManager.prototype.bindClient = function ( socket ) {
    socket.on( "sip_logout", this.logout.bind( this ) );
    socket.on( "sip_login", this.login.bind( this ) );
    socket.on( "addUser", this.addUser.bind( this ) );
    socket.on( "addUserToDestinationMatrix", this.addUserToDestinationMatrix.bind( this ) );
    socket.on( "removeUserToDestinationMatrix", this.removeUserToDestinationMatrix.bind( this ) );
    socket.on( "attachShmdataToUser", this.attachShmdataToUser.bind( this ) );
    socket.on( "callUser", this.callUser.bind( this ) );
    socket.on( "getListStatus", this.getListStatus.bind( this ) );
    socket.on( "hangUpUser", this.hangUpUser.bind( this ) );
    socket.on( "removeUser", this.removeUser.bind( this ) );
};

/*
 *  @function addListUser
 *  @description add to the array listUsers a new users
 */
SipManager.prototype._addUser = function( URI, name, cb ) {
    log.debug( "Adding SIP user..." );
    var addBuddy = this.switcher.invoke( this.config.sip.quiddName, "add_buddy", [URI] );
    if ( !addBuddy ) {
        return cb( "Error adding SIP user " + URI );
    }
    var setName = this.switcher.invoke( this.config.sip.quiddName, "name_buddy", [name, URI] );
    if ( !setName ) {
        return cb( "Error setting SIP user name to " + name + " for " + URI );
    }

    /* Insert a new entry in the dico users */
    var newEntry = this.switcher.invoke( "usersSip", "update", [URI, name] );

    /* save the dico users */
    var usersSavePath = this.config.scenicSavePath + "users.json";
    var saveDicoUsers = this.switcher.invoke( "usersSip", "save", [usersSavePath] );
    if ( !saveDicoUsers ) {
        return cb( "Error saving usersSip dictionary to " + usersSavePath );
    }

    cb( null, "Successfully added SIP user " + URI );
};

/*
 *  @function _createSip
 *  @description set the connection with the server sip. This function is called a initialization of switcher
 */
SipManager.prototype._createSip = function( name, password, address, port, cb ) {
    log.debug( "Creating SIP quiddity", {name: name, address: address, port: port} );
    //@TODO : Encrypt client side and decrypt server side the password

    /* Create the server SIP */
    this.config.sip.quiddName = this.switcher.create( "sip", this.config.sip.quiddName );
    if ( !this.config.sip.quiddName ) {
        var msgError = i18n.t( "Error creating SIP quiddity" );
        log.error( msgError );
        return cb( msgError );
    }
    this.switcher.subscribe_to_property( this.config.sip.quiddName, 'sip-registration' );
    this.switcher.invoke( this.config.sip.quiddName, "unregister", [] );

    /* Define port for Sip Server */
    var port = this.switcher.set_property_value( this.config.sip.quiddName, "port", port );
    if ( !port ) {
        return log.error( "Error setting SIP quiddity port to " + port );
    }

    /* Connect to the server SIP */
    var decrypted = cryptoJS.AES.decrypt( password, secretString ).toString( cryptoJS.enc.Utf8 );

    log.debug( "Attempting SIP server connection", {name: name + "@" + address, password: decrypted} );

    var register = this.switcher.invoke( this.config.sip.quiddName, "register", [name + "@" + address, decrypted] );

    console.log( register, this.config.sip.quiddName, name, address, decrypted );

    if ( !register ) {
        return log.error( i18n.t( "SIP server authentication failed" ) );
    }

    /* subscribe to the modification on this quiddity */
    this.switcher.subscribe_to_signal( this.config.sip.quiddName, "on-tree-grafted" );
    this.switcher.subscribe_to_signal( this.config.sip.quiddName, "on-tree-pruned" );

    /* Add user connected to the sip quiddity */
    this._addUser( name + "@" + address, name, function ( err ) {
        if ( err ) {
            return log.error( err );
        }
    } );

    /* Create dico for DestinationsSip */
    var destinationsSip = this.switcher.create( 'dico', 'destinationsSip' );
    if ( !destinationsSip ) {
        return log.error( "Error creating destinationsSip dictionary" );
    }

    /* Create a dico for Users Save */
    var usersDico = this.switcher.create( "dico", "usersSip" );
    if ( !usersDico ) {
        return log.error( "Error creating usersSip dictionary" );
    }

    /* Try load file users dico */
    var loadUsers = this.switcher.invoke( "usersSip", "load", [this.config.scenicSavePath + "/users.json"] );
    if ( !loadUsers ) {
        log.warn( "No saved file exists for usersSip dictionary" );
    }

    if ( loadUsers ) {
        /* Load Dico Users in quiddity SIP */
        var users = JSON.parse( this.switcher.get_info( "usersSip", ".dico" ) );

        if ( !users.error ) {
            _.each( users, function ( username, key ) {
                this._addUser( key, username, function ( err, info ) {
                    if ( err ) {
                        return log.error( err );
                    }
                    log.debug( info );
                } );
            }, this );
        }
    }

    if ( register == "false" ) {
        var msgErr = i18n.t( "Error registering SIP quiddity" );
        log.error( msgErr );
        return cb( msgErr, null );
    }

    if ( cb ) {
        cb( null );
    }
};


/*
 *  @function getListUsers
 *  @description Return the list of users Sip (for create collection client side)
 */
SipManager.prototype.getListUsers = function () {

    var users = JSON.parse( this.switcher.get_info( this.config.sip.quiddName, "." ) );
    /* get users added to the tab Sip */
    var destinationSip = JSON.parse( this.switcher.get_info( "destinationsSip", ".dico" ) );
    var keys           = _.keys( destinationSip );
    _.each( users.buddy, function ( user, i ) {
        if ( _.contains( keys, user.uri ) ) {
            users.buddy[i]['in_tab'] = true;
        }
    } );

    log.debug( "Get List users", users );
    if ( !users.error ) {
        return users.buddy;
    } else {
        return [];
    }
};

/*
 *  @function login
 *  @description Log user to the server sip
 */
SipManager.prototype.login = function ( sip, cb ) {
    var self = this;

    log.debug( "SIP login attempt: " + sip.name + '@' + sip.address + ':' + sip.port );

    // Remove potential previous SIP quiddity
    this.switcher.remove( this.config.sip.quiddName );

    checkPort( 'SIP', this.config.sip, function ( error ) {
        if ( error ) {
            log.error( error );
            return cb( error );
        }
        // Create new SIP quiddity
        self._createSip( sip.name, sip.password, sip.address, sip.port, function ( err ) {
            if ( err ) {
                return cb( err );
            }
            return cb( null, sip );
        } );
    } );
};

/*
 *  @function logout
 *  @description logout from the server SIP
 */
SipManager.prototype.logout = function ( cb ) {
    log.debug( "ask for logout to the server sip" );
    var unregister = this.switcher.invoke( this.config.sip.quiddName, "unregister", [] );
    console.log( "unregister", unregister );
    if ( this.switcher.remove( this.config.sip.quiddName ) ) {
        return cb( null, true );
    } else {
        var msgErr = i18n.t( "error when try logout server sip" );
        log.error( msgErr )
        return cb( msgErr, false );
    }

};

/*
 *  @function _addUser
 *  @description Add a new user in the dico and server sip
 */
SipManager.prototype.addUser = function ( uri, cb ) {
    log.debug( "ask to add user ", uri );
    this._addUser( uri, uri, function ( err, info ) {
        return cb( err, info );
    } );
};

/*
 *  @function addDestinationSip
 */
SipManager.prototype.addUserToDestinationMatrix = function ( uri, cb ) {
    log.debug( "ask to add ", uri, " to the destinationSip" );

    var addDestinationSip = this.switcher.invoke( "destinationsSip", "update", [uri, uri] );
    if ( !addDestinationSip ) {
        var err = i18n.t( "Error add DestinationSip " ) + uri;
        log.error( err );
        cb( err );
        return;
    }
    this.io.emit( "addDestinationSip", uri );
    cb( null, "successfully added destination " + uri );
};

/*
 *  @function removeDestinationSip
 */
SipManager.prototype.removeUserToDestinationMatrix = function ( uri, cb ) {
    log.debug( "ask to remove ", uri, " to the destinationSip" );
    var removeDestinationSip = this.switcher.invoke( "destinationsSip", "remove", [uri] );
    if ( !removeDestinationSip ) {
        var err = i18n.t( "Error remove DestinationSip " ) + uri;
        log.error( err );
        cb( err );
        return;
    }
    this.io.emit( "removeDestinationSip", uri );
    cb( null, i18n.t( "successfully remove destination " ) + uri );

    /* hang up client if called */
    var call = this.switcher.invoke( this.config.sip.quiddName, 'hang-up', [uri] );
    if ( !call ) {
        var msg = i18n.t( 'error called uri : ' ) + uri;
        log.error( msg );
        return cb( msg )
    }
};

/*
 *  @function addShmdataToUserSip
 */
SipManager.prototype.attachShmdataToUser = function ( user, path, attach, cb ) {
    log.debug( "Shmdata to contact", user, path, attach );
    var attachShm = this.switcher.invoke( this.config.sip.quiddName, "attach_shmdata_to_contact", [path, user, String( attach )] );
    var type      = (attach) ? "attach" : "detach";

    if ( !attachShm ) {
        var err = "error " + type + " shmdata to the user sip";
        log.error( err );
        return cb( err );
    }

    // this.io.emit("addShmdataToUserSip", )
    cb( null, "successfully " + type + " Shmdata to the destination SIP" );
};

SipManager.prototype.callUser = function ( uri, cb ) {
    log.debug( 'Ask to call contact URI ', uri );
    var call = this.switcher.invoke( this.config.sip.quiddName, 'call', [uri] );
    if ( !call ) {
        var msg = 'error called uri : ' + uri;
        log.error( msg );
        return cb( msg )
    }
    cb( null, 'success called contact' );

};

SipManager.prototype.hangUpUser = function ( uri, cb ) {
    log.debug( 'Ask to hang up contact URI ', uri );
    var call = this.switcher.invoke( this.config.sip.quiddName, 'hang-up', [uri] );
    if ( !call ) {
        var msg = 'error called uri : ' + uri;
        log.error( msg );
        return cb( msg )
    }
    cb( null, i18n.t( 'success hang up contact' ) );

};

SipManager.prototype.updateUser = function ( uri, name, statusText, status, cb ) {

    if ( name ) {
        log.debug( 'Update name of the uri ' + uri + ' by ' + name );
        var updateName = this.switcher.invoke( this.config.sip.quiddName, "name_buddy", [name, uri] );
        if ( !updateName ) {
            var msgError = "Error update name " + name;
            log.error( msgError );
            return cb( msgError );
        }
    }

    if ( statusText ) {
        var setStatusNote = this.switcher.set_property_value( this.config.sip.quiddName, 'status-note', statusText );
    }

    if ( status ) {
        var setStatus = this.switcher.set_property_value( this.config.sip.quiddName, 'status', status );
    }

    /* Update name user of dico Users and save */
    var dicoUser      = this.switcher.invoke( "usersSip", "update", [uri, name] );
    var saveDicoUsers = this.switcher.invoke( "usersSip", "save", [this.config.scenicSavePath + "/users.json"] );
    if ( !saveDicoUsers ) {
        return cb( "error saved dico users" );
    }
    cb( null, i18n.t( 'successfully update ' ) + name );

};

SipManager.prototype.removeUser = function ( uri, cb ) {
    log.debug( "remove User " + uri );
    var removeBuddy = this.switcher.invoke( this.config.sip.quiddName, "del_buddy", [uri] );
    if ( !removeBuddy ) {
        return cb( i18n.t( "Error remove __name__ to the sip server", {name: name} ) );
    }

    /* Remove entry in the dico users */
    var removeEntry = this.switcher.invoke( "usersSip", "remove", [uri] );

    /* save the dico users */
    var saveDicoUsers = this.switcher.invoke( "usersSip", "save", [this.config.scenicSavePath + "/users.json"] );
    if ( !saveDicoUsers ) {
        return cb( i18n.t( "error saved dico users" ) );
    }

    cb( null, i18n.t( "User __uri__ successfully removed", {uri: uri} ) );
    this.io.emit( "removeUser", uri );

};

SipManager.prototype.getListStatus = function ( cb ) {
    log.debug( 'ask get list users' );
    var listStatus = this.switcher.get_property_description( this.config.sip.quiddName, "status" );
    if ( listStatus != "" ) {
        cb( null, JSON.parse( listStatus ).values );
    } else {
        cb( null, [] );
    }
};

module.exports = SipManager;