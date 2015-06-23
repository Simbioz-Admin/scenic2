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
    var exists   = fs.existsSync( this.config.contactsPath );
    if ( exists ) {
        var data           = fs.readFileSync( this.config.contactsPath );
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

/**
 * Reconnect the call to a contact
 *
 * @param {string} uri - Contact's URI
 * @returns {boolean} - Success of the reconnection or true if it wasn't necessary to reconnect
 * @private
 */
SipManager.prototype._reconnect = function ( uri ) {
    var contacts = this.getContacts();
    if ( !contacts ) {
        log.warn( 'Could not get contacts while trying to reconnect' );
        return false;
    }
    var contact = _.findWhere( contacts, { uri: uri } );
    if ( !contact ) {
        log.warn( 'Could not find contact while trying to reconnect', uri );
        return false;
    } else if ( contact.send_status == 'calling' ) {
        log.debug( 'Reconnecting to', uri );
        var hungUp = this.hangUpContact( uri );
        if ( !hungUp ) {
            log.warn( 'Could not hang up on contact while trying to reconnect', uri );
        }
        var called = this.callContact( uri );
        if ( !called ) {
            log.warn( 'Could not call contact while trying to reconnect', uri );
        }
        // Only the end result of establishing th call is important
        return called;
    } else {
        return true;
    }
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

        if ( path[0] == 'buddies' ) {
            var buddyId = path[1];

            try {
                var contact = this.switcher.get_info( quiddityId, '.buddies.' + buddyId );
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

//  ██╗      ██████╗  ██████╗ ██╗███╗   ██╗
//  ██║     ██╔═══██╗██╔════╝ ██║████╗  ██║
//  ██║     ██║   ██║██║  ███╗██║██╔██╗ ██║
//  ██║     ██║   ██║██║   ██║██║██║╚██╗██║
//  ███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║
//  ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝

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
    var hasSip     = this.switcherController.quiddityManager.exists( this.config.sip.quiddName );

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
SipManager.prototype.logout = function () {
    log.info( 'Logging out of SIP' );

    var loggedOut = this.switcherController.quiddityManager.invokeMethod( this.config.sip.quiddName, 'unregister', [] );
    if ( !loggedOut ) {
        log.warn( 'Could not log out of SIP' );
        return false;
    }

    this.uri = null;

    return true;
};

//   ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗███████╗
//  ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝
//  ██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║   ███████╗
//  ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║   ╚════██║
//  ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║   ███████║
//   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚══════╝

/**
 * Add Contact to SIP
 *
 * @param {String} uri - Contact's URI
 * @param {String} name - Contact's name
 * @param {Boolean} doNotSave - Skip the saving of the contacts (when doing batch adding, for example)
 */
SipManager.prototype.addContact = function ( uri, name, doNotSave ) {
    log.info( 'Adding contacts', uri, name );

    if ( _.isEmpty( name ) ) {
        name = uri;
    }

    var contactAdded = this.switcherController.quiddityManager.invokeMethod( this.config.sip.quiddName, 'add_buddy', [uri] );
    if ( !contactAdded ) {
        log.warn( 'Could not add contact', uri );
        return false;
    }

    var setName = this.switcherController.quiddityManager.invokeMethod( this.config.sip.quiddName, 'name_buddy', [name, uri] );
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
 * Remove Contact from SIP
 *
 * @param {String} uri - Contact's URI
 * @param {Boolean} doNotSave - Skip the saving of the contacts (when doing batch adding, for example)
 * @returns {Boolean} Success of the removal
 */
SipManager.prototype.removeContact = function ( uri, doNotSave ) {
    log.info( 'Removing contact', uri );
    if ( this.uri && this.contacts[this.uri] && this.contacts[this.uri][uri] ) {
        delete this.contacts[this.uri][uri];
        if ( !doNotSave ) {
            this._saveContacts();
        }
    }

    var contactRemoved = this.switcherController.quiddityManager.invokeMethod( this.config.sip.quiddName, 'del_buddy', [uri] );
    if ( !contactRemoved ) {
        log.warn( 'Could not remove contact', uri );
        return false;
    }

    return true;
};

/**
 * Get Contacts List
 *
 * @returns {Array} List of contacts
 */
SipManager.prototype.getContacts = function () {
    log.info( 'Getting contacts' );

    var hasSipQuiddity = this.switcherController.quiddityManager.exists( this.config.sip.quiddName );
    if ( !hasSipQuiddity ) {
        log.warn( 'Trying to get contacts without a SIP quiddity' );
        return null;
    }

    var contacts = this.switcherController.quiddityManager.getTreeInfo( this.config.sip.quiddName, '.buddies' );
    if ( !contacts ) {
        log.warn( 'Could not get contacts from SIP quiddity' );
        return null;
    }

    // Parse contacts
    contacts = _.values( contacts );
    _.each( contacts, this._parseContact, this );

    return contacts;
};

/**
 * Update contact
 *
 * @param {String} uri - Contact's URI
 * @param {Object} info - Object containing the information to update
 * @returns {Boolean} Success
 */
SipManager.prototype.updateContact = function ( uri, info ) {
    log.info( 'Updating contact', uri, info );

    var success = true;

    if ( info.name ) {
        log.debug( 'Updating name of the contact ' + uri + ' to ' + info.name );
        var nameUpdated = this.switcherController.quiddityManager.invokeMethod( this.config.sip.quiddName, 'name_buddy', [info.name, uri] );
        if ( !nameUpdated ) {
            log.warn( 'Could not update contact name', uri, info.name );
            success = false;
        } else {
            // Add to local contact list
            if ( this.contacts[this.uri] ) {
                this.contacts[this.uri][uri] = info.name;
                this._saveContacts();
            }
        }
    }

    if ( info.status ) {
        log.debug( 'Updating status of the contact ' + uri + ' to ' + info.status );
        // Be careful, status needs to be uppercase to be recognized by switcher
        var statusSet = this.switcherController.quiddityManager.setPropertyValue( this.config.sip.quiddName, 'status', info.status.toUpperCase() );
        if ( !statusSet ) {
            log.warn( 'Could not change contact status', uri, info.status );
            success = false;
        }
    }

    if ( info.status_text ) {
        log.debug( 'Updating status text of the contact ' + uri + ' to ' + info.status_text );
        var textSet = this.switcherController.quiddityManager.setPropertyValue( this.config.sip.quiddName, 'status-note', info.status_text );
        if ( !textSet ) {
            log.warn( 'Could not change contact status message', uri, info.status_text );
            success = false;
        }
    }

    return success;
};

//   ██████╗ ██████╗ ███╗   ██╗███╗   ██╗███████╗██╗  ██╗██╗ ██████╗ ███╗   ██╗███████╗
//  ██╔════╝██╔═══██╗████╗  ██║████╗  ██║██╔════╝╚██╗██╔╝██║██╔═══██╗████╗  ██║██╔════╝
//  ██║     ██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗   ╚███╔╝ ██║██║   ██║██╔██╗ ██║███████╗
//  ██║     ██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝   ██╔██╗ ██║██║   ██║██║╚██╗██║╚════██║
//  ╚██████╗╚██████╔╝██║ ╚████║██║ ╚████║███████╗██╔╝ ██╗██║╚██████╔╝██║ ╚████║███████║
//   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

/**
 * Attach shmdata to SIP contact
 *
 * @param {string} uri - URI of the contact
 * @param {string} path - Path of the shmdata
 * @returns {boolean} - Success
 */
SipManager.prototype.attachShmdataToContact = function ( uri, path ) {
    log.info( 'Attaching shmdata', path, 'to contact', uri );
    var attached = this.switcherController.quiddityManager.invokeMethod( this.config.sip.quiddName, 'attach_shmdata_to_contact', [path, uri, String( true )] );
    if ( !attached ) {
        log.warn( 'Could not attach shmdata', path, 'to contact', uri );
        return false;
    }
    var reconnected = this._reconnect( uri );
    return attached && reconnected;
};

/**
 * Detach shmdata from SIP contact
 *
 * @param {string} uri - Contact URI
 * @param {string} path - Shmdata path
 */
SipManager.prototype.detachShmdataFromContact = function ( uri, path ) {
    log.info( 'Detaching shmdata', path, 'from contact', uri );
    var detached = this.switcherController.quiddityManager.invokeMethod( this.config.sip.quiddName, 'attach_shmdata_to_contact', [path, uri, String( false )] );
    if ( !detached ) {
        log.warn( 'Could not detach shmdata', path, 'from contact', uri );
        return false;
    }
    var reconnected = this._reconnect( uri );
    return detached && reconnected;
};

/**
 * Call a SIP contact
 *
 * @param {string} uri - Contact's URI
 * @returns {boolean} - Success
 */
SipManager.prototype.callContact = function ( uri ) {
    log.info( 'Calling contact', uri );
    var called = this.switcherController.quiddityManager.invokeMethod( this.config.sip.quiddName, 'send', [uri] );
    if ( !called ) {
        log.warn( 'Could not call contact', uri );
    }
    return called;
};

/**
 * Hang up on the contact
 *
 * @param {string} uri - Contact's URI
 * @returns {boolean} - Success
 */
SipManager.prototype.hangUpContact = function ( uri ) {
    log.info( 'Hanging up on contact', uri );
    var hungUp = this.switcherController.quiddityManager.invokeMethod( this.config.sip.quiddName, 'hang-up', [uri] );
    if ( !hungUp ) {
        log.warn( 'Could not hang up on contact' );
    }
    return hungUp;
};

/**
 * Disconnect from the contact
 *
 * @param {string} uri - Contact's URI
 * @returns {boolean} - Success
 */
SipManager.prototype.disconnectContact = function( uri ) {
    log.info('Disconnecting contact', uri);

    // Get the contact list, without it we can't disconnect a contact
    var contacts = this.getContacts();
    if ( !contacts ) {
        return false;
    }

    // Find the related contact, without it there's nothing to disconnect
    var contact = _.findWhere(contacts, {uri:uri});
    if ( !contact ) {
        log.warn('Contact not found', uri);
        return false;
    }

    // If we are calling, hang up first
    if ( contact.send_status == 'calling' ) {
        var hungUp = this.hangUpContact( uri );
        if ( !hungUp ) {
            return false;
        }
    }

    // Then detach shmdatas
    var allDetached = true;
    if ( contact.connections && _.isArray(contact.connections)) {
        _.each( contact.connections, function ( path ) {
            var detached = this.detachShmdataFromContact( uri, path );
            if ( !detached ) {
                allDetached = false;
            }
        }, this );
    }

    return allDetached;
};

module.exports = SipManager;