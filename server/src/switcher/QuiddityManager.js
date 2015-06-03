'use strict';

var _       = require( 'underscore' );
var i18n    = require( 'i18next' );
var log     = require( '../lib/logger' );
var logback = require( '../utils/logback' );

/**
 * Constructor
 *
 * @param config
 * @param switcher
 * @param io
 * @constructor
 */
function QuiddityManager( config, switcher, io ) {
    this.config   = config;
    this.switcher = switcher;
    this.io       = io;

    /**
     * Map of quiddities and their creator's socket id
     * Used to tell clients if they are the creator and thus should display the edit panel, for example
     * @type {{}}
     */
    this.quidditySocketMap = {};

    /**
     * Private quiddities that should not be sent to the client
     * @type {string[]}
     */
    this.privateQuiddities = [
        'dico',
        'create_remove_spy',
        'logger',
        'runtime',
        'systemusage',
        'SOAPcontrolServer'
    ];

    /**
     * Allowed shmdata types
     *
     * @type {string[]}
     */
    this.shmdataTypes = ['reader','writer'];
}

/**
 * Initialize
 */
QuiddityManager.prototype.initialize = function () {

};

/**
 * Binds a new client socket
 *
 * @param socket
 */
QuiddityManager.prototype.bindClient = function ( socket ) {
    socket.on( 'create', this.create.bind( this ) );
    socket.on( 'remove', this.remove.bind( this ) );
    socket.on( 'getQuiddityClasses', this.getQuiddityClasses.bind( this ) );
    socket.on( 'getQuiddities', this.getQuiddities.bind( this ) );
    socket.on( 'getTreeInfo', this.getTreeInfo.bind( this ) );
    socket.on( 'getProperties', this.getProperties.bind( this ) );
    socket.on( 'getPropertyDescription', this.getPropertyDescription.bind( this ) );
    socket.on( 'setPropertyValue', this.setPropertyValue.bind( this ) );
    socket.on( 'getMethods', this.getMethods.bind( this ) );
    socket.on( 'getMethodDescription', this.getMethodDescription.bind( this ) );
    socket.on( 'invokeMethod', this.invokeMethod.bind( this ) );
};

//  ██████╗  █████╗ ██████╗ ███████╗███████╗██████╗ ███████╗
//  ██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝
//  ██████╔╝███████║██████╔╝███████╗█████╗  ██████╔╝███████╗
//  ██╔═══╝ ██╔══██║██╔══██╗╚════██║██╔══╝  ██╔══██╗╚════██║
//  ██║     ██║  ██║██║  ██║███████║███████╗██║  ██║███████║
//  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝

/**
 * Parse a class description into a format more manageable by the front end
 *
 * @param classDescription
 * @returns {*}
 */
QuiddityManager.prototype._parseClass = function ( classDescription ) {
    classDescription.id          = classDescription['class name'];
    classDescription.name        = classDescription['long name'];
    delete classDescription['long name'];
    classDescription.class       = classDescription['class name'];
    delete classDescription['class name'];
    classDescription.description = classDescription['short description'];
    delete classDescription['short description'];
    return classDescription;
};

/**
 * Parse a quiddity into a format more manageable by the front end
 *
 * @param quiddity
 * @returns {*}
 */
QuiddityManager.prototype._parseQuiddity = function ( quiddity ) {
    quiddity.id   = quiddity.name;
    quiddity.name = quiddity['long name'];
    delete quiddity['long name'];
    return quiddity;
};

/**
 * Parse a shmdata into a format more manageable by the front end
 *
 * @param shmdata
 * @returns {*}
 */
QuiddityManager.prototype._parseShmdata = function ( shmdata ) {
    if ( shmdata.byte_rate ) {
        shmdata.byte_rate = parseInt( shmdata.byte_rate );
    }
    return shmdata;
};

/**
 * Parse a property into a format more manageable by the front end
 *
 * @param property
 * @returns {*}
 */
QuiddityManager.prototype._parseProperty = function ( property ) {
    // Value
    switch ( property.type ) {
        case 'float':
        case 'double':
            property.value   = parseFloat( property['default value'] );
            property.default = parseFloat( property['default value'] );
            property.minimum = parseFloat( property.minimum );
            property.maximum = parseFloat( property.maximum );
            break;
        case 'int':
        case 'uint':
            property.value   = parseInt( property['default value'] );
            property.default = parseInt( property['default value'] );
            property.minimum = parseInt( property.minimum );
            property.maximum = parseInt( property.maximum );
            break;
        case 'boolean':
            property.value   = property['default value'].toLowerCase() != 'false';
            property.default = property['default value'].toLowerCase() != 'false';
            break;
        case 'enum':
            property.value   = property['default value'].nick;
            property.default = property['default value'].nick;
            property.options = property.values;
            delete property.values;
            _.each( property.options, function ( option ) {
                option.id    = parseInt( option.value );
                option.value = option.nick;
                delete option.nick;
            } );
            break;
        case 'string':
        default:
            // Try JSON first, switcher doesn't tell us if it's JSON or not
            try {
                var value = JSON.parse( property['default value'] );
            } catch ( e ) {
                value = property['default value'];
            }
            property.value   = value;
            property.default = value;
            break;
    }

    // General
    property.id          = property.name;
    property.name        = property['long name'];
    property.description = property['short description'];
    property.order       = property['position weight'];

    delete property['default value'];
    delete property['long name'];
    delete property['short description'];
    delete property['position category'];
    delete property['position weight'];

    return property;
};

/**
 * Parse a method into a format more manageable by the front end
 *
 * @param method
 * @return {*}
 */
QuiddityManager.prototype._parseMethod = function ( method ) {
    // General
    method.id                = method.name;
    method.name              = method['long name'];
    method.returnType        = method['return type'];
    method.returnDescription = method['return description'];
    method.order             = method['position weight'];

    delete method['default value'];
    delete method['long name'];
    delete method['short description'];
    delete method['return type'];
    delete method['return description'];
    delete method['position category'];
    delete method['position weight'];

    // Arguments
    if ( method['arguments'] ) {
        method.args = method['arguments'];
        delete method['arguments'];
        _.each( method.args, function ( argument ) {
            argument.id   = argument.name;
            argument.name = argument['long name'];

            delete argument['long name'];
        }, this );
    }

    return method;
};

//  ██╗███╗   ██╗████████╗███████╗██████╗ ███╗   ██╗ █████╗ ██╗     ███████╗
//  ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝
//  ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝██╔██╗ ██║███████║██║     ███████╗
//  ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║     ╚════██║
//  ██║██║ ╚████║   ██║   ███████╗██║  ██║██║ ╚████║██║  ██║███████╗███████║
//  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚══════╝

/**
 * On Quiddity Added Handler
 *
 * @param quiddityId
 * @private
 */
QuiddityManager.prototype._onCreated = function ( quiddityId ) {
    log.info( 'Quiddity created:', quiddityId );

    // Quiddity was created, get information on its type
    try {
        var quiddityClass = this.switcher.get_quiddity_description( quiddityId );
    } catch ( e ) {
        return log.error( 'Error while retrieving quiddity information', quiddityId, e );
    }
    if ( !quiddityClass ) {
        return log.error( 'Failed to get information for quiddity', quiddityId );
    } else if ( quiddityClass.error ) {
        return log.error( 'Failed to get information for quiddity', quiddityId, quiddityClass.error );
    }

    // Parse the class
    this._parseQuiddity( quiddityClass );

    log.debug(quiddityClass);

    // Only proceed if it's not on of the 'private' quiddities, they don't matter to the client
    if ( !_.contains( this.privateQuiddities, quiddityClass.class ) ) {

        // Subscribe to property/method add/remove signals
        this.switcher.subscribe_to_signal( quiddityId, 'on-property-added' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-property-removed' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-method-added' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-method-removed' );

        // SOAP Control Client
        if ( quiddityClass.class == 'SOAPcontrolClient' ) {
            log.debug( 'SOAP Control Client, subscribing to on-connection-tried' );
            this.switcher.subscribe_to_signal( quiddityId, 'on-connection-tried' );
        }

        // Subscribe to this quiddity's tree modifications
        this.switcher.subscribe_to_signal( quiddityId, 'on-tree-grafted' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-tree-pruned' );

        // Then subscribe to all of the quiddity's properties
        try {
            var properties = this.switcher.get_properties_description( quiddityId ).properties;
            _.each( properties, function ( property ) {
                this._parseProperty( property );
                log.debug( 'Subscribing to property ' + property.name + ' (' + property.id + ') of ' + quiddityId );
                this.switcher.subscribe_to_property( quiddityId, property.id );
            }, this );
        } catch ( e ) {
            log.error( 'Error getting properties for quiddity', quiddityId, e );
        }

        // Broadcast creation message including the creator's socketId so that the interface can know if they created the quiddity
        this.io.emit( 'create', quiddityClass, this.quidditySocketMap[quiddityId] );
    }
};

/**
 * On Quiddity Removed Handler
 *
 * @param quiddityId
 * @private
 */
QuiddityManager.prototype._onRemoved = function ( quiddityId ) {
    log.info( 'Quiddity removed:', quiddityId );

    // Remove related stuff
    //TODO: Remove connections?
    //TODO: Remove control destinations?

    // Broadcast to clients
    this.io.emit( 'remove', quiddityId );
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
QuiddityManager.prototype.onSwitcherProperty = function ( quiddityId, property, value ) {
    // We exclude byte-rate because it dispatches every second
    log.debug( 'Property:', quiddityId + '.' + property + '=' + value );

    // We have to get the property info in order to parse its value correctly
    // This looks like it isn't necessary but we need the description to handle the value type
    try {
        var propertyInfo = this.switcher.get_property_description( quiddityId, property );
    } catch ( e ) {
        return log.error( e );
    }
    if ( !propertyInfo || !_.isObject(propertyInfo) || propertyInfo.error ) {
        return log.error( 'Could not get property description for', quiddityId, property, value, propertyInfo ? propertyInfo.error : '' );
    }

    // Parse property
    this._parseProperty( propertyInfo );

    // Use the parsed value from now on
    value = propertyInfo.value;
    // Send to clients
    this.io.emit( 'propertyChanged', quiddityId, property, value );

    // If stopping a quiddity, check for associated shmdata and remove them
    if ( property == 'started' && !value ) {
        log.debug( 'Quiddity ' + quiddityId + ' was stopped' );
        //
        //TODO: Remove connections
        //
    }
};

/**
 * Switcher Signal Callback
 *
 * @param quiddityId
 * @param signal
 * @param value
 */
QuiddityManager.prototype.onSwitcherSignal = function ( quiddityId, signal, value ) {

    var parts = value[0].split('.');
    parts.shift();

    // We exclude system usage and shmdata from debug because it dispatches every second
    if ( quiddityId != this.config.systemUsage.quiddName && parts[0] != 'shmdata' ) {
        log.debug( 'Signal:', quiddityId + '.' + signal + '=' + value );
    } else {
        log.verbose( 'Signal:', quiddityId + '.' + signal + '=' + value );
    }

    //  ┌┬┐┬─┐┌─┐┌─┐  ┌─┐┬─┐┌─┐┌─┐┌┬┐┌─┐┌┬┐
    //   │ ├┬┘├┤ ├┤   │ ┬├┬┘├─┤├┤  │ ├┤  ││
    //   ┴ ┴└─└─┘└─┘  └─┘┴└─┴ ┴└   ┴ └─┘─┴┘

    if ( quiddityId !=  this.config.systemUsage.quiddName && signal == 'on-tree-grafted' ) {

        if ( parts[0] == 'shmdata' && parts.length >= 3 ) {
            var graftedShmdataType = parts[1];
            var graftedShmdataPath = parts[2];
            if ( !_.isEmpty( graftedShmdataPath ) && _.contains(this.shmdataTypes, graftedShmdataType) ) {
                try {
                    var shmdataInfo = this.switcher.get_info( quiddityId, '.shmdata.' + graftedShmdataType + '.' + graftedShmdataPath );
                } catch ( e ) {
                    log.error( e );
                }
                if ( !shmdataInfo || !_.isObject(shmdataInfo) || shmdataInfo.error ) {
                    log.error( shmdataInfo ? shmdataInfo.error : 'Could not get shmdata writer info' );
                } else {
                    this._parseShmdata(shmdataInfo);
                    shmdataInfo.path = graftedShmdataPath;
                    shmdataInfo.type = graftedShmdataType;
                    this.io.emit( 'updateShmdata', quiddityId, shmdataInfo );
                }
            }
        }
    }

    //  ┌┬┐┬─┐┌─┐┌─┐  ┌─┐┬─┐┬ ┬┌┐┌┌─┐┌┬┐
    //   │ ├┬┘├┤ ├┤   ├─┘├┬┘│ ││││├┤  ││
    //   ┴ ┴└─└─┘└─┘  ┴  ┴└─└─┘┘└┘└─┘─┴┘

    if ( quiddityId !=  this.config.systemUsage.quiddName && signal == 'on-tree-pruned' ) {

        // Shmdata Writer
        if ( parts[0] == 'shmdata' && parts.length >= 3 ) {
            var prunedShmdataType = parts[1];
            var prunedShmdataPath = parts[2];
            if ( !_.isEmpty( prunedShmdataPath ) && _.contains(this.shmdataTypes, prunedShmdataType) ) {
                this.io.emit( 'removeShmdata', quiddityId, {
                    type: prunedShmdataType,
                    path: prunedShmdataPath
                } );
            }
        }
    }

    //  ┌─┐ ┬ ┬┬┌┬┐┌┬┐┬┌┬┐┬ ┬  ┌─┐┬─┐┌─┐┌─┐┌┬┐┌─┐┌┬┐
    //  │─┼┐│ ││ ││ │││ │ └┬┘  │  ├┬┘├┤ ├─┤ │ ├┤  ││
    //  └─┘└└─┘┴─┴┘─┴┘┴ ┴  ┴   └─┘┴└─└─┘┴ ┴ ┴ └─┘─┴┘

    if ( signal == 'on-quiddity-created' ) {
        // Forward to quiddity manager
        this._onCreated( value[0] );
    }

    //  ┌─┐ ┬ ┬┬┌┬┐┌┬┐┬┌┬┐┬ ┬  ┬─┐┌─┐┌┬┐┌─┐┬  ┬┌─┐┌┬┐
    //  │─┼┐│ ││ ││ │││ │ └┬┘  ├┬┘├┤ ││││ │└┐┌┘├┤  ││
    //  └─┘└└─┘┴─┴┘─┴┘┴ ┴  ┴   ┴└─└─┘┴ ┴└─┘ └┘ └─┘─┴┘

    if ( signal == 'on-quiddity-removed' ) {
        // Forward to quiddity manager
        this._onRemoved( value[0] );
    }

    //  ┌─┐┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐┬ ┬  ┌─┐┌┬┐┌┬┐┌─┐┌┬┐
    //  ├─┘├┬┘│ │├─┘├┤ ├┬┘ │ └┬┘  ├─┤ ││ ││├┤  ││
    //  ┴  ┴└─└─┘┴  └─┘┴└─ ┴  ┴   ┴ ┴─┴┘─┴┘└─┘─┴┘

    if ( signal == 'on-property-added' ) {
        log.debug( 'Subscribing to property', quiddityId, value[0] );
        this.switcher.subscribe_to_property( quiddityId, value[0] );
    }

    //  ┌─┐┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐┬ ┬  ┬─┐┌─┐┌┬┐┌─┐┬  ┬┌─┐┌┬┐
    //  ├─┘├┬┘│ │├─┘├┤ ├┬┘ │ └┬┘  ├┬┘├┤ ││││ │└┐┌┘├┤  ││
    //  ┴  ┴└─└─┘┴  └─┘┴└─ ┴  ┴   ┴└─└─┘┴ ┴└─┘ └┘ └─┘─┴┘

    if ( signal == 'on-property-removed' ) {
        // There is no need to unsubscribe from a removed property
    }

    //  ┌─┐┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐┬ ┬  ┬┌┐┌┌─┐┌─┐
    //  ├─┘├┬┘│ │├─┘├┤ ├┬┘ │ └┬┘  ││││├┤ │ │
    //  ┴  ┴└─└─┘┴  └─┘┴└─ ┴  ┴   ┴┘└┘└  └─┘

    if ( signal == 'on-property-added' || signal == 'on-property-removed' || signal == 'on-method-added' || signal == 'on-method-removed' ) {
        this.io.emit( 'onSignal', quiddityId, signal, value[0] );
    }

    //  ┌─┐┌─┐┌┐┌┌┐┌┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌┬┐┬─┐┬┌─┐┌┬┐
    //  │  │ │││││││├┤ │   │ ││ ││││   │ ├┬┘│├┤  ││
    //  └─┘└─┘┘└┘┘└┘└─┘└─┘ ┴ ┴└─┘┘└┘   ┴ ┴└─┴└─┘─┴┘

    if ( signal == 'on-connection-tried' ) {
        //TODO: Do something with that
        log.warn( '>>>', signal, quiddityId, value, '<<<' );
    }

    //  ┌─┐┬ ┬┌─┐┌┬┐┌─┐┌┬┐  ┬ ┬┌─┐┌─┐┌─┐┌─┐
    //  └─┐└┬┘└─┐ │ ├┤ │││  │ │└─┐├─┤│ ┬├┤
    //  └─┘ ┴ └─┘ ┴ └─┘┴ ┴  └─┘└─┘┴ ┴└─┘└─┘

    if ( quiddityId ==  this.config.systemUsage.quiddName && signal == 'on-tree-grafted' ) {
        var info = this.switcher.get_info( quiddityId, value[0] );
        this.io.emit( 'systemusage', info );
    }
};

//   ██████╗ █████╗ ██╗     ██╗     ██████╗  █████╗  ██████╗██╗  ██╗███████╗
//  ██╔════╝██╔══██╗██║     ██║     ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝
//  ██║     ███████║██║     ██║     ██████╔╝███████║██║     █████╔╝ ███████╗
//  ██║     ██╔══██║██║     ██║     ██╔══██╗██╔══██║██║     ██╔═██╗ ╚════██║
//  ╚██████╗██║  ██║███████╗███████╗██████╔╝██║  ██║╚██████╗██║  ██╗███████║
//   ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝

/**
 * Create Quiddity
 *
 *  @param {string} className The class of the quiddity
 *  @param {string} quiddityName The name (id) of the quiddity
 *  @param {string} socketId Id Socket (socket.io) of the user ask to create the quiddity
 * @param cb
 */
QuiddityManager.prototype.create = function ( className, quiddityName, socketId, cb ) {
    log.info( 'Creating quiddity ' + className + ' named ' + quiddityName );

    // Create the quiddity
    try {
        var result = quiddityName ? this.switcher.create( className, quiddityName ) : this.switcher.create( className );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !result ) {
        return logback( i18n.t( 'Failed to create __className__ __quiddityName__', {
            className:    className,
            quiddityName: quiddityName
        } ), cb );
    }

    var quiddityId = result;
    // Keep a history of who created what
    this.quidditySocketMap[quiddityId] = socketId;

    // Get new quiddity information
    try {
        var quiddInfo = this.switcher.get_quiddity_description( quiddityId );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !quiddInfo || quiddInfo.error || !_.isObject( quiddInfo ) ) {
        return logback( i18n.t( 'Failed to get information for quiddity __quiddityId__', {quiddityId: quiddityId} ) + ( quiddInfo && quiddInfo ? ' ' + quiddInfo.error : '' ), cb );
    }

    // Parse quiddity
    this._parseQuiddity( quiddInfo );

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
    log.info( 'Removing quiddity ' + quiddityId );

    try {
        var result = this.switcher.remove( quiddityId );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !result ) {
        return logback( i18n.t( 'Failed to remove quiddity __quiddityId__', {quiddityId: quiddityId} ), cb );
    }
    log.debug( 'Quiddity ' + quiddityId + ' removed.' );
    cb();
};

/**
 * Get quiddity classes
 *
 * @param cb
 */
QuiddityManager.prototype.getQuiddityClasses = function ( cb ) {
    log.info( 'Getting quiddity classes' );

    try {
        var result = this.switcher.get_classes_doc();
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !result || result.error || !result.classes || !_.isArray( result.classes ) ) {
        return logback( i18n.t( 'Could not get quiddity classes' ) + ( result && result.error ? ' ' + result.error : '' ), cb );
    }
    var classes = _.filter( result.classes, function ( quiddityClass ) {
        return !_.contains( this.privateQuiddities, quiddityClass['class name'] );
    }, this );

    // Parse classes
    _.each( classes, this._parseClass, this );

    cb( null, classes );
};

/**
 * Get Quiddities
 *
 * @param cb
 */
QuiddityManager.prototype.getQuiddities = function ( cb ) {
    log.info( 'Getting quiddities' );

    try {
        var result = this.switcher.get_quiddities_description();
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !result || result.error || !result.quiddities || !_.isArray( result.quiddities ) ) {
        return logback( result && result.error ? result.error : i18n.t( 'Could not get quiddities' ), cb );
    }
    var quiddities = _.filter( result.quiddities, function ( quiddity ) {
        return !_.contains( this.privateQuiddities, quiddity.class );
    }, this );

    // Parse quiddities
    _.each( quiddities, this._parseQuiddity, this );

    cb( null, quiddities );
};

/**
 * Get quiddity tree information
 * @param quiddityId
 * @param path
 * @param cb
 * @returns {*}
 */
QuiddityManager.prototype.getTreeInfo = function ( quiddityId, path, cb ) {
    log.info( 'Getting quiddity information for: ' + quiddityId + ' ' + path );

    try {
        var result = this.switcher.get_info( quiddityId, path );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }

    if ( result && ( !_.isObject(result) || result.error )  ) {
        return logback( i18n.t( 'Could not get informations for __quiddityId__', {quiddityId: quiddityId} ) + ( result && result.error ? ' ' + result.error : '' ), cb );
    }

    return cb( null, result );
};

/**
 * Get properties
 *
 * @param quiddityId
 * @param cb
 * @returns {*}
 */
QuiddityManager.prototype.getProperties = function ( quiddityId, cb ) {
    log.info( 'Getting properties for quiddity: ' + quiddityId );

    try {
        var result = this.switcher.get_properties_description( quiddityId );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !result || result.error || !result.properties || !_.isArray( result.properties ) ) {
        return logback( i18n.t( 'Could not get properties for __quiddityId__', {quiddityId: quiddityId} ) + ( result && result.error ? ' ' + result.error : '' ), cb );
    }

    // Parse properties
    _.each( result.properties, this._parseProperty, this );

    //Return to client
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
    log.info('Getting property description for quiddity ' + quiddityId + ' property ' + property);

    try {
        var result = this.switcher.get_property_description( quiddityId, property );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !result || result.error || _.isEmpty( result ) || !_.isObject( result ) || _.isArray( result ) ) {
        return logback( i18n.t( 'Could not get property description for __quiddityId__ property __property__', {
                quiddityId: quiddityId,
                property:   property
            } ) + ( result && result.error ? ' ' + result.error : '' ), cb )
    }

    // Parse property
    this._parseProperty( result );

    // Return to client
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
    log.info( 'Setting property ' + property + ' of ' + quiddityId + ' to ' + value );

    var self = this;

    if ( !quiddityId || !property || value == null ) {
        return logback( i18n.t( 'Missing arguments to set property value' ) + ' ' + quiddityId + ' ' + property + ' ' + value, cb );
    }

    try {
        var result = this.switcher.set_property_value( quiddityId, property, String( value ) );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !result ) {
        return logback( i18n.t( 'Could not set property __property__ value __value__ on __quiddity__', {
            property: property,
            value:    value,
            quiddity: quiddityId
        } ), cb );
    }

    log.debug( 'The property ' + property + ' of ' + quiddityId + ' was set to ' + value );
    cb();
};

/**
 * Get Methods
 *
 * @param quiddityId
 * @param cb
 */
QuiddityManager.prototype.getMethods = function ( quiddityId, cb ) {
    log.info( 'Getting methods for quiddity ' + quiddityId );
    try {
        var result = this.switcher.get_methods_description( quiddityId );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !result || result.error || !result.methods || !_.isArray( result.methods ) ) {
        return logback( i18n.t( 'Failed to get methods for __quiddityId__', {
                quiddityId: quiddityId
            } ) + ( result && result.error ? ' ' + result.error : '' ), cb );
    }

    // Parse methods
    _.each( result.methods, this._parseMethod, this );

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
    log.info( 'Getting method description for quiddity ' + quiddityId + ' method ' + method );
    try {
        var result = this.switcher.get_method_description( quiddityId, method );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }
    if ( !result || result.error || _.isEmpty( result ) || !_.isObject(result) || _.isArray( result ) ) {
        return logback( i18n.t( 'Could not get method description for __quiddityId__ method __method__', {
                quiddityId: quiddityId,
                method:     method
            } ) + ( result && result.error ? ' ' + result.error : '' ), cb )
    }

    // Parse method
    this._parseMethod( result );

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
    log.info( 'Invoking method ' + method + ' of ' + quiddityId + ' with', parameters );

    if ( !quiddityId || !method || !_.isArray(parameters) ) {
        return logback( i18n.t( 'Missing arguments to invoke method' ) + ' ' + quiddityId + ' ' + method + ' ' + parameters, cb );
    }

    //TODO: Returned strings might cause errors when parsed

    try {
        var result = this.switcher.invoke( quiddityId, method, parameters );
    } catch ( e ) {
        return logback( e.toString(), cb );
    }

    //TODO: Return values are unclear, does an empty string means an error occurred?

    if ( result == null ) {
        return logback( i18n.t( 'Failed to invoke __method__ on __quiddity__', {
            quiddity: quiddityId,
            method:   method
        } ), cb );
    }

    cb( null, result );
};

module.exports = QuiddityManager;