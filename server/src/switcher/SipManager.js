'use strict';

var _         = require( 'underscore' );
var fs        = require( 'fs' );
var i18n      = require( 'i18next' );
var cryptoJS  = require( 'crypto-js' );
var async     = require( 'async' );
var log       = require( '../lib/logger' );
var logback   = require( '../utils/logback' );

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
    socket.on( 'addContact', this._onAddContact.bind( this ) );
    socket.on( 'removeContact', this._onRemoveContact.bind( this ) );
    socket.on( 'updateContact', this._onUpdateContact.bind( this ) );
    socket.on( 'attachShmdataToContact', this.attachShmdataToContact.bind( this ) );
    socket.on( 'detachShmdataFromContact', this.detachShmdataFromContact.bind( this ) );
    socket.on( 'callContact', this.callContact.bind( this ) );
    socket.on( 'hangUpContact', this.hangUpContact.bind( this ) );
};

//  ██████╗  █████╗ ██████╗ ███████╗███████╗██████╗ ███████╗
//  ██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝
//  ██████╔╝███████║██████╔╝███████╗█████╗  ██████╔╝███████╗
//  ██╔═══╝ ██╔══██║██╔══██╗╚════██║██╔══╝  ██╔══██╗╚════██║
//  ██║     ██║  ██║██║  ██║███████║███████╗██║  ██║███████║
//  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝

/**
 * Parse contact into a more manageable format for the client
 *
 * @param contact
 * @private
 */
SipManager.prototype._parseContact = function ( contact ) {
    contact.id   = contact.uri;
    contact.self = ( this.uri == contact.uri );
    return contact;
};

//  ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
//  ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
//  ██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
//  ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
//  ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
//  ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝

/**
 * Add User to SIP
 *
 * @param uri
 * @param name
 * @param cb
 */
SipManager.prototype.addContact = function ( uri, name, cb ) {
    if ( uri == null || name == null ) {
        return cb( i18n.t('Missing information to add contact') );
    }

    var contactAdded = this.switcher.invoke( this.config.sip.quiddName, 'add_buddy', [uri] );
    if ( !contactAdded ) {
        return cb( i18n.t( 'Could not add contact __contact__', {contact: uri} ) );
    }

    var setName = this.switcher.invoke( this.config.sip.quiddName, 'name_buddy', [name, uri] );
    if ( !setName ) {
        return cb( i18n.t( 'Error setting contact name to __name__ for __contact__', {name: name, contact: uri} ) );
    }

    // Update save file
    this._updateSavedContact( uri, name, cb );
};

/**
 * Remove User from SIP
 *
 * @param uri
 * @param cb
 */
SipManager.prototype.removeContact = function ( uri, cb ) {
    if ( uri == null ) {
        return cb( i18n.t('Missing information to remove contact') );
    }

    var contactRemoved = this.switcher.invoke( this.config.sip.quiddName, 'del_buddy', [uri] );
    if ( !contactRemoved ) {
        return cb( i18n.t( 'Could not remove contact __contact__', {contact: uri} ) );
    }

    // Update save file
    this._removeSavedContact( uri, cb );
};

/**
 * Load contacts from file
 *
 * @param callback
 * @private
 */
SipManager.prototype._loadContacts = function ( callback ) {
    log.info( 'Loading contacts', this.config.contactsPath );

    var self = this;

    fs.exists( self.config.contactsPath, function ( exists ) {
        if ( exists ) {
            fs.readFile( self.config.contactsPath, function ( error, data ) {
                if ( error ) {
                    return callback( 'Error loading contacts (' + error + ')' );
                }

                try {
                    var contacts = JSON.parse( data );
                } catch ( e ) {
                    return callback( 'Error parsing contacts (' + e.toString() + ')' );
                }

                if ( contacts ) {
                    // Cleanup
                    _.each( contacts, function( contact ) {
                        // We have those appearing at oone point during dev, just clearing them out
                        delete contact['null'];
                    });
                    log.debug(contacts);
                    callback( null, contacts);
                } else {
                    callback( null, {} );
                }
            } );
        } else {
            return callback( null, {} );
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
SipManager.prototype._saveContacts = function ( contacts, callback ) {
    log.info( 'Saving contacts', this.config.contactsPath );
    var self = this;
    log.debug( contacts );
    fs.writeFile( self.config.contactsPath, JSON.stringify( contacts ), callback );
};

/**
 * Update contact in save file
 *
 * @param uri
 * @param name
 * @param callback
 * @private
 */
SipManager.prototype._updateSavedContact = function ( uri, name, callback ) {
    log.info('Updating contact', uri, name );

    var self = this;

    self._loadContacts( function ( error, contacts ) {
        if ( error ) {
            log.warn( error );
            contacts = {};
        }

        if ( !contacts[self.uri] ) {
            contacts[self.uri] = {};
        }

        contacts[self.uri][uri] = name;

        self._saveContacts( contacts, function ( error ) {
            if ( error ) {
                log.warn( error );
            }
            callback();
        } )
    } );
};

/**
 * Update contact in save file
 *
 * @param uri
 * @param callback
 * @private
 */
SipManager.prototype._removeSavedContact = function ( uri, callback ) {
    log.info('Removing contact', uri);

    var self = this;

    self._loadContacts( function ( error, contacts ) {
        if ( error ) {
            log.warn( error );
            return callback();
        }

        if ( !contacts[self.uri] ) {
            return callback();
        }

        delete contacts[self.uri][uri];

        self._saveContacts( contacts, function ( error ) {
            if ( error ) {
                log.warn( error );
            }
            callback();
        } )
    } );
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
                log.debug( 'Reconnecting to', uri );
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

//  ███████╗██╗   ██╗██████╗ ███████╗ ██████╗██████╗ ██╗██████╗ ████████╗██╗ ██████╗ ███╗   ██╗███████╗
//  ██╔════╝██║   ██║██╔══██╗██╔════╝██╔════╝██╔══██╗██║██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
//  ███████╗██║   ██║██████╔╝███████╗██║     ██████╔╝██║██████╔╝   ██║   ██║██║   ██║██╔██╗ ██║███████╗
//  ╚════██║██║   ██║██╔══██╗╚════██║██║     ██╔══██╗██║██╔═══╝    ██║   ██║██║   ██║██║╚██╗██║╚════██║
//  ███████║╚██████╔╝██████╔╝███████║╚██████╗██║  ██║██║██║        ██║   ██║╚██████╔╝██║ ╚████║███████║
//  ╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

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
    if ( quiddityId == this.config.sip.quiddName && ( signal == 'on-tree-grafted' || signal == 'on-tree-pruned' ) ) {
        var path = value[0].split('.');
        path.shift();

        if ( path[0] == 'buddy' ) {
            var buddyId = path[1];

            try {
                var contact = this.switcher.get_info( quiddityId, '.buddy.' + buddyId );
            } catch ( e ) {
                return log.error( e );
            }

            if ( !contact || contact.error ) {
                // We silently fail here because leaving contacts don't exist obviously
                return;
            }

            // Parse contact
            this._parseContact( contact );

            this.io.emit( 'contactInfo', contact );
        }
    }
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

    var uri = credentials.user + '@' + credentials.server;

    // Remove previous
    try {
        var hasSip = this.switcher.has_quiddity( this.config.sip.quiddName );
    } catch ( e ) {
        return logback( e, cb );
    }

    // Setup new instance
    var self = this;
    async.series( [

        // Create SIP quiddity
        function ( callback ) {
            // Creation
            if ( !hasSip ) {
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
            if ( !registered ) {
                return callback( i18n.t( 'SIP authentication failed' ) );
            }

            self.uri = credentials.user + '@' + credentials.server;

            self.addContact( self.uri, credentials.user, function ( error ) {
                if ( error ) {
                    return callback( i18n.t( 'Error while adding self to contacts (__error__)', {error: e.toString()} ) );
                }
                callback();
            } );
        },

        function( callback ) {
            self._loadContacts( function ( error, contacts ) {
                if ( error ) {
                    log.warn( error );
                    return callback();
                }

                if ( contacts[credentials.user + '@' + credentials.server] ) {
                    _.each( contacts[credentials.user + '@' + credentials.server], function ( contactName, contactURI ) {
                        // addUser is synchronous, callback is only there to get error information
                        self.addContact( contactURI, contactName, function ( error ) {
                            if ( error ) {
                                log.warn( error );
                            }
                        } );
                    } );
                }

                callback();
            } );
        }

    ], function ( error ) {
        if ( error ) {
            return logback( error, cb );
        }

        self.uri = uri;

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
        var loggedOut = this.switcher.invoke( this.config.sip.quiddName, 'unregister', [] );
    } catch ( e ) {
        return logback( i18n.t( 'Error while logging out (__error__)', {error: e.toString()} ) );
    }
    if ( !loggedOut ) {
        return logback( i18n.t( 'Could not log out from SIP' ) );
    }

    cb();
};

/**
 * Get Contacts List
 *
 * @param cb
 */
SipManager.prototype.getContacts = function ( cb ) {
    log.info( 'Getting contacts' );

    try {
        var hasSipQuiddity = this.switcher.has_quiddity( this.config.sip.quiddName );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !hasSipQuiddity ) {
        return cb( null, [] );
    }

    try {
        var contacts = this.switcher.get_info( this.config.sip.quiddName, '.buddy' );
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
SipManager.prototype._onAddContact = function ( uri, cb ) {
    log.info( 'Adding contact', uri );

    this.addContact( uri, uri, function( error ) {
        if ( error ) {
            return logback( i18n.t( 'Error while adding contact (__error__)', {error: error} ), cb );
        }
        cb();
    } );
};

/**
 * Remove contact
 *
 * @param uri
 * @param cb
 * @returns {*}
 */
SipManager.prototype._onRemoveContact = function ( uri, cb ) {
    log.info( 'Removing contact', uri );

    this.removeContact( uri, function( error ) {
        if ( error ) {
            return logback( i18n.t( 'Error while removing contact (__error__)', {error: error} ), cb );
        }
        cb();
    });
};

/**
 * Update contact
 *
 * @param uri
 * @param info
 * @param cb
 * @returns {*}
 */
SipManager.prototype._onUpdateContact = function ( uri, info, cb ) {
    log.info('Updating contact', uri, info );

    var self = this;

    async.parallel( [

        // Name
        function( callback ) {
            if ( info.name ) {
                log.debug( 'Updating name of the contact ' + uri + ' to ' + info.name );
                try {
                    var nameUpdated = self.switcher.invoke( self.config.sip.quiddName, 'name_buddy', [info.name, uri] );
                } catch ( e ) {
                    return callback( i18n.t( 'Error while updating contact name (__error__)', {error: e.toString()} ));
                }
                if ( !nameUpdated ) {
                    return callback( i18n.t( 'Could not update contact name' ) );
                }

                self._updateSavedContact( uri, info.name, callback );
            } else {
                callback();
            }
        },

        // Status
        function( callback ) {
            if ( info.status ) {
                log.debug( 'Updating status of the contact ' + uri + ' to ' + info.status );
                try {
                    // Be careful, status needs to be uppercase to be recognized by switcher
                    var statusSet = self.switcher.set_property_value( self.config.sip.quiddName, 'status', info.status.toUpperCase() );
                } catch (e ) {
                    return callback( i18n.t('Error while changing contact __contact__ status to __status__ (__error__)', {
                        contact: uri,
                        status:  info.status,
                        error:   e.toString()
                    }));
                }
                if ( !statusSet ) {
                    return callback( i18n.t('Could not change contact __contact__ status to __status__', {
                        contact: uri,
                        status:  info.status
                    }));
                }
                callback();
            } else {
                callback()
            }
        },

        // Status Text
        function( callback ) {
            if ( info.status_text ) {
                log.debug( 'Updating status text of the contact ' + uri + ' to ' + info.status_text );
                try {
                    var textSet = self.switcher.set_property_value( self.config.sip.quiddName, 'status-note', info.status_text );
                } catch ( e ) {
                    return callback( i18n.t( 'Error while changing contact __contact__ status text to __text__ (__error__)', {
                        contact: uri,
                        text:    info.status_text,
                        error:   e.toString()
                    } ) );
                }
                if ( !textSet ) {
                    return callback( i18n.t( 'Could not change contact __contact__ status text to __text__', {
                        contact: uri,
                        text:    info.status_text
                    } ) );
                }
                callback();
            } else {
                callback();
            }
        }

    ], function( error ) {
        if ( error ) {
            return logback( error, cb );
        }
        cb();
    });
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
    log.info( 'Attaching shmdata', path, 'to contact', uri );

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
    log.info( 'Detaching shmdata', path, 'from contact', uri );

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
    log.info('Calling contact', uri );

    try {
        var called = this.switcher.invoke( this.config.sip.quiddName, 'send', [uri] );
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
    log.info('Hanging up on contact', uri);

    try {
        var hanged = this.switcher.invoke( this.config.sip.quiddName, 'hang-up', [uri] );
    } catch ( e ) {
        return logback( i18n.t( 'Error hanging up on contact (__error__)', {error: e.toString()} ), cb );
    }
    if ( !hanged ) {
        return logback( i18n.t( 'Could not hang up on contact' ), cb );
    }
    cb();
};

module.exports = SipManager;