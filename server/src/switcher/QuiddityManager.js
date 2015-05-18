"use strict";

var _       = require( 'underscore' );
var i18n    = require( 'i18next' );
var log     = require( '../lib/logger' );
var logback = require( './logback' );

/**
 * Constructor
 *
 * @param config
 * @param switcher
 * @param io
 * @constructor
 */
function QuiddityManager( config, switcher, io ) {
    this.config            = config;
    this.switcher          = switcher;
    this.io                = io;
    this.quidditySocketMap = {};
}

/**
 * Binds a new client socket
 *
 * @param socket
 */
QuiddityManager.prototype.bindClient = function ( socket ) {
    socket.on( "getQuiddityClasses", this.getQuiddityClasses.bind( this ) );
    socket.on( "getQuiddities", this.getQuiddities.bind( this ) );
    socket.on( "getInfo", this.getInfo.bind( this ) );
    socket.on( "getProperties", this.getProperties.bind( this ) );
    socket.on( "getPropertyByClass", this.getPropertyByClass.bind( this ) );
    socket.on( "getPropertyDescription", this.getPropertyDescription.bind( this ) );
    socket.on( "setPropertyValue", this.setPropertyValue.bind( this ) );
    socket.on( "getMethods", this.getMethods.bind( this ) );
    socket.on( "getMethodDescription", this.getMethodDescription.bind( this ) );
    socket.on( "invokeMethod", this.invokeMethod.bind( this ) );
    socket.on( "create", this.create.bind( this ) );
    socket.on( "remove", this.remove.bind( this ) );
    //
    //
    //
    socket.on( "get_quiddity_description", this.get_description.bind( this ) );
    socket.on( "get_property_value", this.get_property_value.bind( this ) );
    socket.on( "subscribe_info_quidd", this.subscribe_info_quidd.bind( this ) );
    socket.on( "unsubscribe_info_quidd", this.unsubscribe_info_quidd.bind( this ) );
    socket.on( "setPropertyValueOfDico", this.set_property_value_of_dico.bind( this ) );
    socket.on( "removeValuePropertyOfDico", this.remove_property_value_of_dico.bind( this ) );
};

//   ██████╗ █████╗ ██╗     ██╗     ██████╗  █████╗  ██████╗██╗  ██╗███████╗
//  ██╔════╝██╔══██╗██║     ██║     ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝
//  ██║     ███████║██║     ██║     ██████╔╝███████║██║     █████╔╝ ███████╗
//  ██║     ██╔══██║██║     ██║     ██╔══██╗██╔══██║██║     ██╔═██╗ ╚════██║
//  ╚██████╗██║  ██║███████╗███████╗██████╔╝██║  ██║╚██████╗██║  ██╗███████║
//   ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝

/**
 * Get quiddity classes
 *
 * @param cb
 */
QuiddityManager.prototype.getQuiddityClasses = function ( cb ) {
    log.debug( 'Getting quiddity classes' );
    try {
        var result = JSON.parse( this.switcher.get_classes_doc() );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !result || !result.classes ) {
        return logback( i18n.t( 'Could not get quiddity classes' ), cb );
    }
    cb( null, result.classes );
};

/**
 * Get Quiddities
 *
 * @param cb
 */
QuiddityManager.prototype.getQuiddities = function ( cb ) {
    log.debug( 'Getting quiddities' );
    try {
        var quiddDescriptions = JSON.parse( this.switcher.get_quiddities_description() );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !quiddDescriptions || quiddDescriptions.error ) {
        return logback( quiddDescriptions ? quiddDescriptions.error : i18n.t( 'Could not get quiddities' ), cb );
    }
    cb( null, quiddDescriptions.quiddities );
};

/**
 * Get quiddity information
 * @param quiddityId
 * @param path
 * @param cb
 * @returns {*}
 */
QuiddityManager.prototype.getInfo = function ( quiddityId, path, cb ) {
    log.debug( 'Getting quiddity information for: ' + quiddityId + ' ' + path );
    try {
        var info = JSON.parse( this.switcher.get_info( quiddityId, path ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !info || info.error ) {
        return logback( info ? info.error : i18n.t( 'Could not get informations for __quiddityId__', {quiddityId: quiddityId} ), cb );
    }
    return cb( null, info );
};

/**
 * Get properties by class
 *
 * Used to get devices of a certain type
 *
 * @param className
 * @param propertyName
 * @param cb
 * @returns {*}
 */
QuiddityManager.prototype.getPropertyByClass = function ( className, propertyName, cb ) {
    log.debug( "Getting property " + propertyName + " for class " + className );
    try {
        var result = JSON.parse( this.switcher.get_property_description_by_class( className, propertyName ) );
    } catch(e) {
        return logback( e, cb );
    }
    if ( !result || result.error ) {
        return logback( result ? result.error : i18n.t('Could not get property __propertyName__ for class __className__', { propertyName: propertyName, className: className }));
    }
    cb( null, result );
};

/**
 * Get properties
 *
 * @param quiddityId
 * @param cb
 * @returns {*}
 */
QuiddityManager.prototype.getProperties = function ( quiddityId, cb ) {
    log.debug( 'Getting properties for quiddity: ' + quiddityId );
    try {
        var result = JSON.parse( this.switcher.get_properties_description( quiddityId ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !result || !result.properties || result.error ) {
        return logback( result && result.error ? result.error : i18n.t( 'Could not get properties for __quiddityId__', {quiddityId: quiddityId} ), cb );
    }
    cb( null, result.properties );
};

/**
 * Get property description
 *
 * @param quiddityId
 * @param property
 * @param cb
 */
QuiddityManager.prototype.getPropertyDescription = function ( quiddityId, property, cb ) {
    try {
        var result = JSON.parse( this.switcher.get_property_description( quiddityId, property ) );
    } catch( e ) {
        return logback( e, cb );
    }
    if ( !result || result.error ) {
        return logback( i18n.t( 'Could not get property description for __quiddityId__ property __property__', { quiddityId: quiddityId, property: property } ) + ' ' + ( result ? result.error : '' ) )
    }
    cb( null, result );
};

/**
 * Set Property Value
 *
 * @param quiddityId
 * @param property
 * @param value
 * @param cb
 */
QuiddityManager.prototype.setPropertyValue = function ( quiddityId, property, value, cb ) {
    var self = this;
    if ( quiddityId && property && value ) {
        try {
            var result = this.switcher.set_property_value( quiddityId, property, String( value ) );
        } catch( e ) {
            logback( e, cb );
        }
        if ( !result ) {
            logback( i18n.t( 'Could not set property __property__ value __value__ on __quiddity__', {
                property: property,
                value:    value,
                quiddity: quiddityId
            } ), cb );
        }
        log.debug( 'The property ' + property + ' of ' + quiddityId + ' was set to ' + value );
        cb( );
    } else {
        logback( i18n.t('Missing arguments to set property value:') + ' ' + quiddityId + ' ' + property + ' ' + value );
    }
};

/**
 * Get Methods
 *
 * @param quiddityId
 * @param cb
 */
QuiddityManager.prototype.getMethods = function ( quiddityId, cb ) {
    log.debug( 'Getting methods for quiddity: ' + quiddityId );
    try {
        var result = JSON.parse( this.switcher.get_methods_description( quiddityId ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !result || !result.methods || result.error ) {
        return logback( i18n.t( "Failed to get methods for __quiddityId__", {quiddityId: quiddityId} ) );
    }
    cb( null, result.methods );
};

/**
 * Get method description
 *
 * @param quiddityId
 * @param method
 * @param cb
 * @returns {*}
 */
QuiddityManager.prototype.getMethodDescription = function ( quiddityId, method, cb ) {
    try {
        var result = JSON.parse( this.switcher.get_method_description( quiddityId, method ) );
    } catch( e ) {
        return logback( e, cb );
    }
    if ( !result || result.error ) {
        return logback( i18n.t( 'Could not get method description for __quiddityId__ method __method__', { quiddityId: quiddityId, method: method } ) + ' ' + ( result ? result.error : '' ) )
    }
    cb( null, result );
};

/**
 * Invoke method on quiddity
 *
 * @param quiddityId
 * @param method
 * @param parameters
 * @param cb
 * @returns {*}
 */
QuiddityManager.prototype.invokeMethod = function ( quiddityId, method, parameters, cb ) {
    log.debug( "Invoking method " + method + " of " + quiddityId + " with", parameters );
    try {
        var invoke = this.switcher.invoke( quiddityId, method, parameters );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !invoke ) {
        return logback( i18n.t( "Failed to invoke __method__ on __quiddity__", {
            quiddity: quiddityId,
            method:    method
        } ) );
    }
    cb( null, invoke );

    //TODO: What the hell is this?
    if ( method == "remove_udp_stream_to_dest" ) {
        this.io.emit( "remove_connection", invoke, quiddityId, parameters );
    }
};

/**
 * Create Quiddity
 *
 *  @param {string} className The class of the quiddity
 *  @param {string} quiddityName The name (id) of the quiddity
 *  @param {string} socketId Id Socket (socket.io) of the user ask to create the quiddity
 * @param cb
 */
QuiddityManager.prototype.create = function ( className, quiddityName, socketId, cb ) {
    log.debug( 'Creating quiddity ' + className + ' named ' + quiddityName );

    // Create the quiddity
    try {
        var result = quiddityName ? this.switcher.create( className, quiddityName ) : this.switcher.create( className );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !result ) {
        return logback( i18n.t( "Failed to create __className__ __quiddityName__", {
            className:    className,
            quiddityName: quiddityName
        } ), cb );
    }

    var quiddityId = result;
    // Keep a history of who created what
    this.quidditySocketMap[quiddityId] = socketId;

    // Get new quiddity information
    try {
        var quiddInfo = JSON.parse( this.switcher.get_quiddity_description( quiddityId ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !quiddInfo || quiddInfo.error ) {
        return logback( quiddInfo ? quiddInfo.error : i18n.t('Failed to get information for quiddity __quiddityId__', {quiddityId: quiddityId}) );
    }
    cb( null, quiddInfo );
};

/**
 * Remove quiddity
 * Removes the quiddity and all those associated with it (eg ViewMeter, preview, etc. ..)
 *
 * @param {string} quiddityId The name (id) of the quiddity
 * @param cb
 */
QuiddityManager.prototype.remove = function ( quiddityId, cb ) {
    log.debug( 'Removing quiddity ' + quiddityId );
    try {
        var result = this.switcher.remove( quiddityId );
    } catch ( e ) {
        return logback( e, cb );
    }
    //FIXME: Result is false even when quiddity is removed
    /*if ( !result ) {
     return logback( i18n.t( 'Failed to remove quiddity __quiddityId__', {quiddityId: quiddityId} ), cb );
     }*/
    log.debug( "Quiddity " + quiddityId + " removed." );
    cb();
};

//  ██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗
//  ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝
//  ██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝
//  ██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝
//  ███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║
//  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝
//


QuiddityManager.prototype.removeElementsAssociateToQuiddRemoved = function ( quiddName ) {
    var self   = this;
    log.debug( "LEGACY >>> Removing associate quiddities for", quiddName );
    var quidds = JSON.parse( this.switcher.get_quiddities_description() ).quiddities;
    if ( !quidds ) {
        return log.error( "LEGACY >>> Failed removing associated quiddities for " + quiddName );
    }

    this.removeConrolByQuiddParent( quiddName );

    /* Remove quiddity sink base on quidd removed  or vumeter */
    _.each( quidds, function ( quidd ) {
        if ( quidd.name.indexOf( quiddName + "-sink" ) != -1 ) {
            log.debug( 'LEGACY >>> Removing ' + quidd.name );
            this.switcher.remove( quidd.name );
        }
        /*Handled in switcher controller if ( quidd.name.indexOf( "vumeter_" ) >= 0 && quidd.name.indexOf( quiddName ) >= 0 ) {
            log.debug( 'LEGACY >>> Removing ' + quidd.name );
            this.switcher.remove( quidd.name );
        }*/
    }, this );
};


QuiddityManager.prototype.get_description = function ( quiddName, cb ) {
    log.debug( "get Description quidd", quiddName );

    var quiddDescription = JSON.parse( this.switcher.get_quiddity_description( quiddName ) );
    log.debug( quiddDescription );
    if ( quiddDescription.error ) {
        cb( quiddDescription.error );
        return
    }

    cb( null, quiddDescription );
};








QuiddityManager.prototype.get_properties_values = function ( quiddName ) {
    var self            = this;
    var propertiesQuidd = this.switcher.get_properties_description( quiddName );
    if ( propertiesQuidd == "" ) {
        log.error( "failed to get properties description of" + quiddName );
        return;
    }

    propertiesQuidd = JSON.parse( propertiesQuidd ).properties;

    //recover the value set for the properties
    _.each( propertiesQuidd, function ( property, index ) {
        var valueOfproperty = this.switcher.get_property_value( quiddName, property.name );
        if ( property.name == "shmdata-writers" ) {
            valueOfproperty = JSON.parse( valueOfproperty );
        }
        propertiesQuidd[index].value = valueOfproperty;
    }, this );

    return propertiesQuidd;
};




QuiddityManager.prototype.get_property_value = function ( quiddName, property, cb ) {
    log.debug( "Get property value", quiddName, property );
    if ( quiddName && property ) {
        try {
            var property_value = JSON.parse( this.switcher.get_property_value( quiddName, property ) );
        } catch ( e ) {
            var property_value = this.switcher.get_property_value( quiddName, property );
        }
    } else {
        var msg = i18n.t( "failed to get property value (quiddity __quiddName__ -  property __property__", {
            quiddName: quiddName,
            property:  property
        } );
        cb( msg );
        log.error( msg );
        return;
    }
    cb( null, property_value );
};



QuiddityManager.prototype.subscribe_info_quidd = function ( quiddName, socketId ) {
    log.debug( "socketId (" + socketId + ") subscribe info " + quiddName );
    this.config.subscribe_quidd_info[socketId] = quiddName;
};

QuiddityManager.prototype.unsubscribe_info_quidd = function ( quiddName, socketId ) {
    log.debug( "socketId (" + socketId + ") unsubscribe info " + quiddName );
    delete this.config.subscribe_quidd_info[socketId];
};

QuiddityManager.prototype.set_property_value_of_dico = function ( property, value, callback ) {
    var currentValueDicoProperty = JSON.parse( this.switcher.invoke( "dico", "read", [property] ) );
    if ( currentValueDicoProperty ) {
        currentValueDicoProperty[currentValueDicoProperty.length] = value;
    } else {
        var currentValueDicoProperty = [value];
    }

    this.switcher.set_property_value( "dico", property, JSON.stringify( currentValueDicoProperty ) );
    this.io.emit( "setDicoValue", property, value );
    callback( "ok" );
};

QuiddityManager.prototype.removeConrolByQuiddParent = function ( quiddParent ) {
    var currentValuesDicoProperty = JSON.parse( this.switcher.invoke( "dico", "read", ['controlDestinations'] ) );
    _.each( currentValuesDicoProperty, function ( control ) {
        if ( control.quiddName == quiddParent ) {
            remove_property_value_of_dico( "controlDestinations", control.name );
        }
    } )
};

QuiddityManager.prototype.remove_property_value_of_dico = function ( property, name ) {
    var self                      = this;
    var currentValuesDicoProperty = JSON.parse( this.switcher.invoke( "dico", "read", [property] ) );
    var newValuesDico             = [];
    _.each( currentValuesDicoProperty, function ( value ) {
        if ( value.name != name ) {
            newValuesDico.push( value );
        }
    } );

    if ( property == "controlDestinations" ) {
        /* parse all quidds for remove mapper associate */
        var quidds = JSON.parse( this.switcher.get_quiddities_description() ).quiddities;

        /* Remove quiddity sink base on quidd removed */
        _.each( quidds, function ( quidd ) {
            if ( quidd.name.indexOf( "mapper" ) >= 0 && quidd.name.indexOf( name ) >= 0 ) {
                this.switcher.remove( quidd.name );
            }
        }, this );
    }

    log.debug( "Remove property", property, name );

    this.switcher.invoke( "dico", "update", [property, JSON.stringify( newValuesDico )] );
    this.io.emit( "removeValueOfPropertyDico", property, name );
};

module.exports = QuiddityManager;