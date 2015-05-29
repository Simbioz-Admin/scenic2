'use strict';

var _         = require( 'underscore' );
var fs         = require( 'fs' );
var i18n      = require( 'i18next' );
var cryptoJS  = require( 'crypto-js' );
var async     = require( 'async' );
var log       = require( '../lib/logger' );
var logback   = require( '../utils/logback' );
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
    this.config   = config;
    this.switcher = switcher;
    this.io       = io;
}

/**
 * Initialize
 */
SipManager.prototype.initialize = function () {
    this.uri = null;
};

/**
 * Binds a new client socket
 *
 * @param socket
 */
SipManager.prototype.bindClient = function ( socket ) {
    socket.on( 'sipLogin', this.login.bind( this ) );
    socket.on( 'sipLogout', this.logout.bind( this ) );
    socket.on( 'getContacts', this.getContacts.bind( this ) );
    socket.on( 'addContact', this.addContact.bind( this ) );
    socket.on( 'attachShmdataToContact', this.attachShmdataToContact.bind( this ) );
    socket.on( 'detachShmdataFromContact', this.detachShmdataFromContact.bind( this ) );
    socket.on( 'callContact', this.callContact.bind( this ) );
    socket.on( 'hangUpContact', this.hangUpContact.bind( this ) );

    //
    //
    //
    socket.on( 'getListStatus', this.getListStatus.bind( this ) );
    socket.on( 'removeUser', this.removeUser.bind( this ) );
};


/**
 * Switcher Property Callback
 *
 * @param quiddityId
 * @param property
 * @param value
 */
SipManager.prototype.onSwitcherProperty = function ( quiddityId, property, value ) {

};

/**
 * Switcher Signal Callback
 *
 * @param quiddityId
 * @param signal
 * @param value
 */
SipManager.prototype.onSwitcherSignal = function ( quiddityId, signal, value ) {
    if ( ( signal == 'on-tree-grafted' || signal == 'on-tree-pruned' ) && quiddityId == this.config.sip.quiddName && value[0].indexOf( '.buddy' ) == 0 ) {
        //TODO: We need a new way to get added buddies that don't require tree grafts and dot splits
        var buddyId = value[0].split( '.' )[2];
        var contact = JSON.parse( this.switcher.get_info( quiddityId, '.buddy.' + buddyId ) );

        // Parse contact
        this._parseContact( contact );

        this.io.emit( 'contactInfo', contact );
    }
};

/**
 * Add User to SIP
 *
 * @param uri
 * @param user
 * @param cb
 */
SipManager.prototype._addUser = function ( uri, user, cb ) {
    log.debug( 'Adding SIP user', uri, user );
    try {
        var addedBuddy = this.switcher.invoke( this.config.sip.quiddName, 'add_buddy', [uri] );
    } catch ( e ) {
        return cb( e );
    }
    if ( !addedBuddy ) {
        return cb( i18n.t( 'Error adding SIP user __user__', {user: uri} ) );
    }

    try {
        var setName = this.switcher.invoke( this.config.sip.quiddName, 'name_buddy', [user, uri] );
    } catch ( e ) {
        return cb( e );
    }
    if ( !setName ) {
        return cb( i18n.t( 'Error setting SIP user name to __user__ for __uri__', {user: user, uri: uri} ) );
    }
    cb();
};

/**
 * Parse contact into a more manageable format for the client
 *
 * @param contact
 * @private
 */
SipManager.prototype._parseContact = function ( contact ) {
    contact.id = contact.uri;
    contact.self = this.uri == contact.uri;
    return contact;
};

/**
 * Load contacts from file
 *
 * @param callback
 * @private
 */
SipManager.prototype._loadContacts = function( callback ) {
    var self = this;
    log.info('Loading contacts', self.config.contactsPath);
    fs.exists( self.config.contactsPath, function( exists ) {
        if ( exists ) {
            fs.readFile( self.config.contactsPath, function( error, data ) {
                if ( error ) {
                    return callback( 'Error loading contacts (' + error + ')' );
                }

                try {
                    var contacts = JSON.parse( data );
                } catch (e ) {
                    return callback( 'Error parsing contacts (' + e.toString() + ')');
                }

                callback( null, contacts ? contacts : [] );
            } );
        } else {
            return callback( null, []);
        }
    } );
};

/**
 * Save Contacts
 *
 * @param contacts
 * @param callback
 * @private
 */
SipManager.prototype._saveContacts = function( contacts, callback ) {
    var self = this;
    log.info('Saving contacts', self.config.contactsPath);
    log.debug( contacts);
    fs.writeFile( self.config.contactsPath, JSON.stringify(contacts), callback );
};

/**
 * Reconnect the call to a contact
 *
 * @param uri
 * @param cb
 * @private
 */
SipManager.prototype._reconnect = function ( uri, cb ) {

    var self     = this;
    var contacts = null;

    async.series( [

        // Get Contacts
        function ( callback ) {
            self.getContacts( function ( error, result ) {
                if ( error ) {
                    return callback( error );
                }
                contacts = result;
                callback();
            } );
        },

        // Reset connection if needed
        function ( callback ) {
            var contact = _.findWhere( contacts, {uri: uri} );
            if ( contact && contact.send_status == 'calling' ) {
                log.debug('Reconnecting to', uri);
                self.hangUpContact( uri, function ( error ) {
                    if ( error ) {
                        return callback( error );
                    }
                    self.callContact( uri, function ( error ) {
                        if ( error ) {
                            return callback( error );
                        }
                        callback();
                    } )
                } )
            } else if ( !contact ) {
                log.warn( 'Contact could not be found while reconnecting', uri );
                callback();
            } else {
                callback();
            }
        }
    ], function ( error ) {
        if ( error ) {
            return logback( error, cb );
        }
        cb();
    } );
};

//   ██████╗ █████╗ ██╗     ██╗     ██████╗  █████╗  ██████╗██╗  ██╗███████╗
//  ██╔════╝██╔══██╗██║     ██║     ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝
//  ██║     ███████║██║     ██║     ██████╔╝███████║██║     █████╔╝ ███████╗
//  ██║     ██╔══██║██║     ██║     ██╔══██╗██╔══██║██║     ██╔═██╗ ╚════██║
//  ╚██████╗██║  ██║███████╗███████╗██████╔╝██║  ██║╚██████╗██║  ██╗███████║
//   ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝

/**
 * SIP Login
 *
 * @param credentials
 * @param cb
 */
SipManager.prototype.login = function ( credentials, cb ) {
    log.info( 'SIP login attempt: ' + credentials.user + '@' + credentials.server + ':' + credentials.port );

    this.uri = null;

    if ( !credentials ) {
        return logback( i18n.t( 'Missing credentials' ), cb );
    }

    if ( !credentials.server ) {
        return logback( i18n.t( 'Missing server' ), cb );
    }

    if ( !credentials.user ) {
        return logback( i18n.t( 'Missing user' ), cb );
    }

    if ( credentials.port ) {
        if ( isNaN( parseInt( credentials.port ) ) ) {
            return logback( i18n.t( 'Invalid SIP Port __port__', {port: credentials.port} ) );
        }
        this.config.sip.port = parseInt( credentials.port );
    }

    // Remove previous
    try {
        var hasSip = JSON.parse( this.switcher.has_quiddity( this.config.sip.quiddName ) );
    } catch ( e ) {
        return logback( e, cb );
    }

    //TODO: Remove once sip-registration property bug is resolved (we don't get notified of status changes
    if ( hasSip ) {
        log.debug( 'Removing previous SIP quiddity instance' );
        try {
            this.switcher.remove( this.config.sip.quiddName );
        } catch ( e ) {
            return logback( e, cb );
        }
    }

    // Setup new instance
    var self = this;
    async.series( [

        // Check if port is available
        function ( callback ) {
            checkPort( 'SIP', self.config.sip, callback );
        },

        // Create SIP quiddity
        function ( callback ) {
            // Creation
            //TODO: Remove || hasSip once sip-registration property bug is resolved (we don't get notified of status changes
            if ( !hasSip || hasSip ) {
                log.debug( 'Creating new SIP quiddity' );
                try {
                    var sip = self.switcher.create( 'sip', self.config.sip.quiddName );
                } catch ( e ) {
                    return callback( i18n.t( 'Error creating SIP quiddity (__error__)', {error: e.toString()} ) );
                }
                if ( !sip || sip == 'false' ) {
                    return callback( i18n.t( 'Error creating SIP quiddity' ) );
                }
            }

            // Subscription (We already subscribe to all)
            /*log.debug('Subscribing to SIP registration status');
             try {
             self.switcher.subscribe_to_property( self.config.sip.quiddName, 'sip-registration' );
             } catch( e ) {
             return callback( i18n.t('Error subscribing to SIP registration (__error__)', {error:e.toString()}) );
             }*/

            // Unregister all (Fresh quiddity no need for that)
            /*try {
             self.switcher.invoke( self.config.sip.quiddName, 'unregister', [] );
             } catch( e ) {
             return callback( i18n.t('Error unregistering all SIP users (__error__)', {error:e.toString()}) );
             }*/

            // Port
            log.debug( 'Setting SIP port' );
            try {
                var port = self.switcher.set_property_value( self.config.sip.quiddName, 'port', String( self.config.sip.port ) );
            } catch ( e ) {
                return callback( i18n.t( 'Error setting SIP port to __port__ (__error__)', {
                    port:  self.config.sip.port,
                    error: e.toString()
                } ) );
            }
            if ( !port || port == 'false' ) {
                return callback( i18n.t( 'Error setting SIP port to __port__', {port: self.config.sip.port} ) );
            }

            // Register
            log.debug( 'Registering user' );
            var decrypted = cryptoJS.AES.decrypt( credentials.password, secretString ).toString( cryptoJS.enc.Utf8 );
            try {
                var registered = self.switcher.invoke( self.config.sip.quiddName, 'register', [credentials.user + '@' + credentials.server, decrypted] );
            } catch ( e ) {
                return callback( i18n.t( 'Error registering SIP user (__error__)', {error: e.toString()} ) );
            }
            if ( !registered || registered == 'false' ) {
                return callback( i18n.t( 'SIP authentication failed' ) );
            }
            callback();
        },

        // Add User
        function ( callback ) {
            self._addUser( credentials.user + '@' + credentials.server, credentials.user, callback );
        },

        // Load Contacts
        function( callback ) {
            self._loadContacts( function( error, contacts ) {
                if ( error ) {
                    log.warn( error );
                    return callback();
                }

                if ( contacts[ credentials.user + '@' + credentials.server ] ) {
                    _.each( contacts[credentials.user + '@' + credentials.server], function( name, uri ) {
                        // addUser is synchronous, callback is only there to get error information
                        self._addUser( uri, name, function( error ) {
                            if ( error ) {
                                log.warn(error);
                            }
                        } );
                    });
                }

                callback();
            });
        }

    ], function ( error ) {
        if ( error ) {
            return logback( error, cb );
        }

        self.uri = credentials.user + '@' + credentials.server;

        cb();
    } );
};

/**
 * Logout
 *
 * @param cb
 */
SipManager.prototype.logout = function ( cb ) {
    log.info( 'Logging out of SIP' );

    this.uri = null;

    try {
        var loggedOut = JSON.parse(this.switcher.invoke( this.config.sip.quiddName, 'unregister', [] ));
    } catch ( e ) {
        return logback( i18n.t('Error while logging out (__error__)', {error: e.toString()}));
    }
    if ( !loggedOut ) {
        return logback( i18n.t('Could not log out from SIP'));
    }

    try {
        //This one is boolean for whatever reason...
        var removed = this.switcher.remove( this.config.sip.quiddName );
    } catch ( e ) {
        return logback( i18n.t( 'Error while removing SIP quiddity (__error__)', {error: e.toString()} ) );
    }
    if ( !loggedOut ) {
        return logback( i18n.t('Could not remove SIP quiddity'));
    }

    cb();
};

/**
 * Get Contacts List
 *
 * @param cb
 */
SipManager.prototype.getContacts = function ( cb ) {
    log.debug( 'Getting contacts' );
    try {
        var hasSipQuiddity = JSON.parse( this.switcher.has_quiddity( this.config.sip.quiddName ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !hasSipQuiddity ) {
        return cb( null, [] );
    }

    try {
        var contacts = JSON.parse( this.switcher.get_info( this.config.sip.quiddName, '.buddy' ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !contacts ) {
        return logback( i18n.t( 'Could not get contacts' ) );
    }

    // Parse contacts
    contacts = _.values( contacts );
    _.each( contacts, this._parseContact, this );

    cb( null, contacts );
};

/**
 * Add Contact
 *
 * @param uri
 * @param cb
 */
SipManager.prototype.addContact = function ( uri, cb ) {
    log.debug( 'Adding contact', uri );
    var self = this;
    this._addUser( uri, uri, function ( error ) {
        if ( error ) {
            return logback( error, cb );
        }

        self._loadContacts( function( error, contacts ) {
            if ( error ) {
                log.warn(error);
                contacts = {};
            }

            if ( !contacts[ self.uri ] ) {
                contacts[self.uri] = {};
            }

            contacts[self.uri][uri] = uri;

            self._saveContacts( contacts, function( error ) {
                if (error) {
                    log.warn(error);
                }
                cb();
            })
        });
    } );
};

/**
 * Attach shmdata to SIP contact
 *
 * @param path
 * @param uri
 * @param cb
 * @returns {*}
 */
SipManager.prototype.attachShmdataToContact = function ( path, uri, cb ) {
    log.debug('Attaching shmdata', path, 'to contact',uri);
    var self = this;
    async.series( [

        // Attach
        function ( callback ) {
            try {
                var attached = self.switcher.invoke( self.config.sip.quiddName, 'attach_shmdata_to_contact', [path, uri, String( true )] );
            } catch ( e ) {
                return callback( i18n.t( 'Error attaching shmdata to contact (__error__)', {error: e.toString()} ) );
            }
            if ( !attached ) {
                return callback( i18n.t( 'Could not attach shmdata to contact' ) );
            }
            callback();
        },

        function ( callback ) {
            self._reconnect( uri, callback );
        }

    ], function ( error ) {
        if ( error ) {
            return logback( error, cb );
        }
        cb();
    } );
};

/**
 * Detach shmdata from SIP contact
 *
 * @param path
 * @param uri
 * @param cb
 */
SipManager.prototype.detachShmdataFromContact = function ( path, uri, cb ) {
    log.debug('Detaching shmdata', path, 'from contact',uri);
    var self = this;
    async.series( [

        // Detach
        function ( callback ) {
            try {
                var detached = self.switcher.invoke( self.config.sip.quiddName, 'attach_shmdata_to_contact', [path, uri, String( false )] );
            } catch ( e ) {
                return logback( i18n.t( 'Error detaching shmdata from contact (__error__)', {error: e.toString()} ), cb );
            }
            if ( !detached ) {
                return logback( i18n.t( 'Could not detach shmdata from contact' ), cb );
            }
            callback();
        },

        function ( callback ) {
            self._reconnect( uri, callback );
        }

    ], function ( error ) {
        if ( error ) {
            return logback( error, cb );
        }
        cb();
    } );
};

/**
 * Call a SIP contact
 *
 * @param uri
 * @param cb
 * @returns {*}
 */
SipManager.prototype.callContact = function ( uri, cb ) {
    try {
        var called = JSON.parse( this.switcher.invoke( this.config.sip.quiddName, 'send', [uri] ) );
    } catch ( e ) {
        return logback( i18n.t( 'Error calling contact (__error__)', {error: e.toString()} ), cb );
    }
    if ( !called ) {
        return logback( i18n.t( 'Could not call contact' ), cb );
    }
    cb();
};

/**
 * Hang up on the contact
 *
 * @param uri
 * @param cb
 * @returns {*}
 */
SipManager.prototype.hangUpContact = function ( uri, cb ) {
    try {
        var hanged = JSON.parse( this.switcher.invoke( this.config.sip.quiddName, 'hang-up', [uri] ) );
    } catch ( e ) {
        return logback( i18n.t( 'Error hanging up on contact (__error__)', {error: e.toString()} ), cb );
    }
    if ( !hanged ) {
        return logback( i18n.t( 'Could not hang up on contact' ), cb );
    }
    cb();
};

//  ██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗
//  ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝
//  ██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝
//  ██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝
//  ███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║
//  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝
//






SipManager.prototype.updateUser = function ( uri, name, statusText, status, cb ) {

    if ( name ) {
        log.debug( 'Update name of the uri ' + uri + ' by ' + name );
        var updateName = this.switcher.invoke( this.config.sip.quiddName, 'name_buddy', [name, uri] );
        if ( !updateName ) {
            var msgError = 'Error update name ' + name;
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
    var dicoUser      = this.switcher.invoke( 'usersSip', 'update', [uri, name] );
    var saveDicoUsers = this.switcher.invoke( 'usersSip', 'save', [this.config.scenicSavePath + '/users.json'] );
    if ( !saveDicoUsers ) {
        return cb( 'error saved dico users' );
    }
    cb( null, i18n.t( 'successfully update ' ) + name );

};

SipManager.prototype.removeUser = function ( uri, cb ) {
    log.debug( 'remove User ' + uri );
    var removeBuddy = this.switcher.invoke( this.config.sip.quiddName, 'del_buddy', [uri] );
    if ( !removeBuddy ) {
        return cb( i18n.t( 'Error remove __name__ to the sip server', {name: name} ) );
    }

    /* Remove entry in the dico users */
    var removeEntry = this.switcher.invoke( 'usersSip', 'remove', [uri] );

    /* save the dico users */
    var saveDicoUsers = this.switcher.invoke( 'usersSip', 'save', [this.config.scenicSavePath + '/users.json'] );
    if ( !saveDicoUsers ) {
        return cb( i18n.t( 'error saved dico users' ) );
    }

    cb( null, i18n.t( 'User __uri__ successfully removed', {uri: uri} ) );
    this.io.emit( 'removeUser', uri );

};

SipManager.prototype.getListStatus = function ( cb ) {
    log.debug( 'ask get list users' );
    var listStatus = this.switcher.get_property_description( this.config.sip.quiddName, 'status' );
    if ( listStatus != '' ) {
        cb( null, JSON.parse( listStatus ).values );
    } else {
        cb( null, [] );
    }
};

module.exports = SipManager;