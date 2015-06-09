'use strict';

var _        = require( 'underscore' );
var fs       = require( 'fs' );
var i18n     = require( 'i18next' );
var cryptoJS = require( 'crypto-js' );
var async    = require( 'async' );
var log      = require( '../lib/logger' );
var logback  = require( '../utils/logback' );

var secretString = 'Les patates sont douces!';

/**
 * Constructor
 *
 * @param switcherController
 * @constructor
 */
function SipManager( switcherController ) {
    this.switcherController = switcherController;
    this.config             = this.switcherController.config;
    this.switcher           = this.switcherController.switcher;
    this.io                 = this.switcherController.io;
    this.contacts           = {};
}

/**
 * Initialize
 */
SipManager.prototype.initialize = function () {
    this.uri = null;
    this._loadContacts();
};

/**
 * Binds a new client socket
 *
 * @param socket
 */
SipManager.prototype.bindClient = function ( socket ) {
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

//  ██╗███╗   ██╗████████╗███████╗██████╗ ███╗   ██╗ █████╗ ██╗     ███████╗
//  ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝
//  ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝██╔██╗ ██║███████║██║     ███████╗
//  ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║     ╚════██║
//  ██║██║ ╚████║   ██║   ███████╗██║  ██║██║ ╚████║██║  ██║███████╗███████║
//  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚══════╝

/**
 * Load contacts from file
 *
 * @returns {Array} Contact list
 * @private
 */
SipManager.prototype._loadContacts = function () {
    log.info( 'Loading contacts', this.config.contactsPath );
    var contacts = {};
    var exists   = fs.existsSync( self.config.contactsPath );
    if ( exists ) {
        var data           = fs.readFileSync( self.config.contactsPath );
        var parsedContacts = JSON.parse( data );
        if ( parsedContacts ) {
            // Cleanup
            _.each( parsedContacts, function ( contact ) {
                // We have those appearing at one point during dev, just clearing them out
                delete contact['null'];
            } );
            contacts = parsedContacts;
            log.debug( contacts );
        }
    }
    return this.contacts = contacts;
};

/**
 * Save Contacts
 *
 * @param {Function} [callback]
 * @private
 */
SipManager.prototype._saveContacts = function ( callback ) {
    log.info( 'Saving contacts', this.config.contactsPath );
    fs.writeFile( this.config.contactsPath, JSON.stringify( this.contacts ), function ( error ) {
        if ( error ) {
            this.warn( error );
        }
        if ( callback ) {
            return callback( error );
        }
    } );
};

//  ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
//  ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
//  ██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
//  ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
//  ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
//  ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝

/**
 * Add Contact to SIP
 *
 * @param {String} uri - Contact's URI
 * @param {String} name - Contact's name
 * @param {Boolean} doNotSave - Skip the saving of the contacts (when doing batch adding, for example)
 */
SipManager.prototype.addContact = function ( uri, name, doNotSave ) {
    var contactAdded = this.switcher.invoke( this.config.sip.quiddName, 'add_buddy', [uri] );
    if ( !contactAdded ) {
        log.warn( 'Could not add contact', uri );
        return false;
    }

    var setName = this.switcher.invoke( this.config.sip.quiddName, 'name_buddy', [name, uri] );
    if ( !setName ) {
        log.warn( 'Could not set contact name', uri, name );
        return false;
    }

    // Add to local contact list
    if ( !this.contacts[this.uri] ) {
        this.contacts[this.uri] = {};
    }
    this.contacts[this.uri][uri] = name;

    if ( !doNotSave ) {
        this._saveContacts();
    }

    return true;
};

/**
 * Remove User from SIP
 *
 * @param {String} uri - Contact's URI
 * @param {Boolean} doNotSave - Skip the saving of the contacts (when doing batch adding, for example)
 * @returns {Boolean} Success of the removal
 */
SipManager.prototype.removeContact = function ( uri, doNotSave ) {
    if ( this.uri && this.contacts[this.uri] && this.contacts[this.uri][uri] ) {
        delete this.contacts[this.uri][uri];
        if ( !doNotSave ) {
            this._saveContacts();
        }
    }

    var contactRemoved = this.switcher.invoke( this.config.sip.quiddName, 'del_buddy', [uri] );
    if ( !contactRemoved ) {
        log.warn( 'Could not remove contact', uri );
        return false;
    }

    return true;
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
        var path = value[0].split( '.' );
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

//  ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
//  ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
//  ██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
//  ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
//  ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
//  ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝

/**
 * SIP Login
 *
 * @param {Object} credentials - Credentials used to log into SIP
 * @returns {Boolean} Success
 */
SipManager.prototype.login = function ( credentials ) {
    log.info( 'SIP login attempt: ' + credentials.user + '@' + credentials.server + ':' + credentials.port );

    this.uri = null;

    this.config.sip.port = parseInt( credentials.port );

    var uri = credentials.user + '@' + credentials.server;

    // Check if we already have a SIP quiddity
    var hasSip     = this.switcher.has_quiddity( this.config.sip.quiddName );

    // Create the SIP quiddity if needed
    if ( !hasSip ) {
        log.debug( 'Creating new SIP quiddity' );
        var sip = this.switcherController.quiddityManager.create( 'sip', this.config.sip.quiddName );
        if ( sip == null ) {
            log.error( 'Could not create SIP quiddity' );
            return false;
        }
    }

    // Port
    log.debug( 'Setting SIP port' );
    var portSet    = this.switcherController.quiddityManager.setPropertyValue( this.config.sip.quiddName, 'port', this.config.sip.port );
    if ( !portSet ) {
        log.error( 'Could not set SIP port', this.config.sip.port );
        return false;
    }

    // Register
    log.debug( 'Registering user' );
    var decrypted  = cryptoJS.AES.decrypt( credentials.password, secretString ).toString( cryptoJS.enc.Utf8 );
    var registered = this.switcherController.quiddityManager.invokeMethod( this.config.sip.quiddName, 'register', [uri, decrypted] );
    if ( !registered ) {
        log.warn( 'SIP Authentication failed' );
        return false;
    }

    // Save the user's URI
    this.uri = uri;

    // Add self to the contact list
    this.addContact( this.uri, credentials.user, true );

    // Add user's contacts
    if ( this.contacts && this.contacts[uri] ) {
        _.each( this.contacts[uri], function ( contactName, contactURI ) {
            this.addContact( contactURI, contactName, true );
        }, this );
    }

    // Save contacts (async, but we don't care about when it finishes)
    this._saveContacts();

    return true;
};

/**
 * Logout
 *
 * @returns {Boolean} Success
 */
SipManager.prototype.logout = function ( ) {
    log.info( 'Logging out of SIP' );

    var loggedOut = this.switcher.invoke( this.config.sip.quiddName, 'unregister', [] );
    if ( !loggedOut ) {
        log.warn('Could not log out of SIP');
        return false;
    }

    this.uri = null;

    return true;
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

    this.addContact( uri, uri, function ( error ) {
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

    this.removeContact( uri, function ( error ) {
        if ( error ) {
            return logback( i18n.t( 'Error while removing contact (__error__)', {error: error} ), cb );
        }
        cb();
    } );
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
    log.info( 'Updating contact', uri, info );

    var self = this;

    async.parallel( [

        // Name
        function ( callback ) {
            if ( info.name ) {
                log.debug( 'Updating name of the contact ' + uri + ' to ' + info.name );
                try {
                    var nameUpdated = self.switcher.invoke( self.config.sip.quiddName, 'name_buddy', [info.name, uri] );
                } catch ( e ) {
                    return callback( i18n.t( 'Error while updating contact name (__error__)', {error: e.toString()} ) );
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
        function ( callback ) {
            if ( info.status ) {
                log.debug( 'Updating status of the contact ' + uri + ' to ' + info.status );
                try {
                    // Be careful, status needs to be uppercase to be recognized by switcher
                    var statusSet = self.switcher.set_property_value( self.config.sip.quiddName, 'status', info.status.toUpperCase() );
                } catch ( e ) {
                    return callback( i18n.t( 'Error while changing contact __contact__ status to __status__ (__error__)', {
                        contact: uri,
                        status:  info.status,
                        error:   e.toString()
                    } ) );
                }
                if ( !statusSet ) {
                    return callback( i18n.t( 'Could not change contact __contact__ status to __status__', {
                        contact: uri,
                        status:  info.status
                    } ) );
                }
                callback();
            } else {
                callback()
            }
        },

        // Status Text
        function ( callback ) {
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

    ], function ( error ) {
        if ( error ) {
            return logback( error, cb );
        }
        cb();
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
    log.info( 'Calling contact', uri );

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
    log.info( 'Hanging up on contact', uri );

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