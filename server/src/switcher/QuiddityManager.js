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
     * VU Meter List
     * This is how we keep track of created vu meters
     * @type {Array}
     */
    this.vuMeters = [];

    /**
     * Private quiddities that should not be sent to the client
     * @type {string[]}
     */
    this.privateQuiddities = ['dico', 'create_remove_spy'/*, 'rtpsession'*/, 'logger', 'runtime', 'systemusage', 'SOAPcontrolServer'];

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
    socket.on( 'getQuiddityClasses', this.getQuiddityClasses.bind( this ) );
    socket.on( 'getQuiddities', this.getQuiddities.bind( this ) );
    socket.on( 'getInfo', this.getInfo.bind( this ) );
    socket.on( 'getProperties', this.getProperties.bind( this ) );
    socket.on( 'getPropertyByClass', this.getPropertyByClass.bind( this ) );
    socket.on( 'getPropertyDescription', this.getPropertyDescription.bind( this ) );
    socket.on( 'setPropertyValue', this.setPropertyValue.bind( this ) );
    socket.on( 'getMethods', this.getMethods.bind( this ) );
    socket.on( 'getMethodDescription', this.getMethodDescription.bind( this ) );
    socket.on( 'invokeMethod', this.invokeMethod.bind( this ) );
    socket.on( 'create', this.create.bind( this ) );
    socket.on( 'remove', this.remove.bind( this ) );
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
QuiddityManager.prototype._parseClass = function( classDescription ) {
    classDescription.id = classDescription['class name'];
    classDescription.name = classDescription['long name'];
    delete classDescription['long name'];
    classDescription.class = classDescription['class name'];
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
QuiddityManager.prototype._parseQuiddity = function( quiddity ) {
    quiddity.id = quiddity.name;
    quiddity.name = quiddity['long name'];
    delete quiddity['long name'];
    return quiddity;
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
                option.id    = parseInt(option.value);
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
QuiddityManager.prototype._onAdded = function ( quiddityId ) {
    // Quiddity was created, get information on its type
    try {
        var quiddityClass = JSON.parse( this.switcher.get_quiddity_description( quiddityId ) );
    } catch ( e ) {
        return log.error( 'Error while retrieving quiddity information', quiddityId, e ) ;
    }
    if ( !quiddityClass ) {
        return log.error( 'Failed to get information for quiddity', quiddityId );
    } else if ( quiddityClass.error ) {
        return log.error( 'Failed to get information for quiddity', quiddityId, quiddityClass.error );
    }

    // Parse the class
    this._parseQuiddity(quiddityClass);

    // Only proceed if it's not on of the 'private' quiddities, they don't matter to the client
    if ( !_.contains( this.privateQuiddities, quiddityClass.class ) ) {

        // Subscribe to property/method add/remove signals
        this.switcher.subscribe_to_signal( quiddityId, 'on-property-added' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-property-removed' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-method-added' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-method-removed' );

        // SOAP Control Client
        if ( quiddityClass.class == 'SOAPcontrolClient' ) {
            log.debug('SOAP Control Client, subscribing to on-connection-tried');
            this.switcher.subscribe_to_signal( quiddityId, 'on-connection-tried' );
        }

        // Subscribe to this quiddity's tree modifications
        this.switcher.subscribe_to_signal( quiddityId, 'on-tree-grafted' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-tree-pruned' );

        // Then subscribe to all of the quiddity's properties
        try {
            var properties = JSON.parse( this.switcher.get_properties_description( quiddityId ) ).properties;
            _.each( properties, function ( property ) {
                this._parseProperty(property);
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
    log.debug( 'Quiddity ' + quiddityId + ' removed' );

    // Remove related stuff
    this.removeVuMeters( quiddityId );
    //TODO: Remove connections?
    //TODO: Remove control destinations?

    // Broadcast to clients
    this.io.emit( 'remove', quiddityId );
};

/**
 * Remove quiddity's VU meters
 *
 * @deprecated
 * @param quiddityId
 */
QuiddityManager.prototype.removeVuMeters = function ( quiddityId ) {
    log.debug( 'Removing VU meters for ' + quiddityId );
    //TODO: Maybe use var quidds = JSON.parse( this.switcher.get_quiddities_description() ).quiddities; and look for quidd.name.indexOf( 'vumeter_' ) && quidd.name.indexOf( quiddName )
    this.vuMeters = _.filter( this.vuMeters, function ( vuMeter ) {
        if ( vuMeter.quiddity == quiddityId ) {
            log.debug( 'Removing VU meter: ' + vuMeter.path );
            this.switcher.remove( vuMeter.path );
            return false;
        } else {
            return true;
        }
    }, this );
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
    if ( property != 'byte-rate' ) {
        log.debug( 'Property:', quiddityId + '.' + property + '=' + value );
    }

    // We have to get the property info in order to parse its value correctly
    // This looks like it isn't necessary but we need the description to handle the value type
    try {
        var propertyInfo = JSON.parse( this.switcher.get_property_description( quiddityId, property ) );
    } catch ( e ) {
        return log.error( e );
    }
    if ( !propertyInfo || propertyInfo.error ) {
        return log.error( 'Could not get property description for', quiddityId, property, value, propertyInfo ? propertyInfo.error : '' );
    }

    // Parse property
    this._parseProperty( propertyInfo );

    // Use the parsed value from now on
    value = propertyInfo.value;
    // Send to clients
    this.io.emit( 'propertyChanged', quiddityId, property, value );

    // If stopping a quiddity, check for associated shmdata and remove them
    if ( property == 'started' && value == 'false' ) {
        log.debug( 'Quiddity ' + quiddityId + ' was stopped' );
        this.removeVuMeters( quiddityId );
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

    // We exclude byte-rate from debug because it dispatches every second
    if ( quiddityId != 'systemusage' ) {
        log.debug( 'Signal:', quiddityId + '.' + signal + '=' + value );
    }

    //  ┌┬┐┬─┐┌─┐┌─┐  ┌─┐┬─┐┌─┐┌─┐┌┬┐┌─┐┌┬┐
    //   │ ├┬┘├┤ ├┤   │ ┬├┬┘├─┤├┤  │ ├┤  ││
    //   ┴ ┴└─└─┘└─┘  └─┘┴└─┴ ┴└   ┴ └─┘─┴┘

    if ( quiddityId != 'systemusage' && signal == 'on-tree-grafted' ) {

        // Shmdata Writer
        if ( value[0].indexOf( '.shmdata.writer' ) >= 0 ) {
            var path = value[0].replace( '.shmdata.writer.', '' );
            if ( !_.isEmpty(path)) {
                var shmdataWriterInfo  = JSON.parse( this.switcher.get_info( quiddityId, value[0] ) );
                shmdataWriterInfo.path = path;
                shmdataWriterInfo.type = 'writer';

                // VU Meters
                log.debug( 'Creating VU meters for ' + quiddityId );
                var shmdataWriters     = JSON.parse( this.switcher.get_info( quiddityId, '.shmdata.writer' ) );
                _.each( shmdataWriters, function ( shmdata, name ) {
                    var path = 'vumeter_' + name;
                    //TODO: This could probably be better if we query fakesinks instead of keeping them internally
                    var vuMeterExists = _.findWhere( this.vuMeters, {path: path} );
                    if ( !vuMeterExists ) {
                        log.debug( 'Creating VU meter for shmdata ' + name );
                        var vuMeter = this.switcher.create( 'fakesink', path );
                        if ( vuMeter ) {
                            this.vuMeters.push( {quiddity: quiddityId, path: vuMeter} );
                            this.switcher.invoke( vuMeter, 'connect', [name] );
                        } else {
                            log.warn( 'Could not create VU Meter for ' + name );
                        }
                    }
                }, this );
                this.io.emit( 'addShmdata', quiddityId, shmdataWriterInfo );
            }
        }

        // Shmdata Reader
        if ( value[0].indexOf( '.shmdata.reader' ) >= 0 ) {
            var path = value[0].replace( '.shmdata.reader.', '' );
            if ( !_.isEmpty(path) ) {
                var shmdataReaderInfo  = JSON.parse( this.switcher.get_info( quiddityId, value[0] ) );
                shmdataReaderInfo.path = path;
                shmdataReaderInfo.type = 'reader';
                this.io.emit( 'addShmdata', quiddityId, shmdataReaderInfo );
            }
        }
    }

    //  ┌┬┐┬─┐┌─┐┌─┐  ┌─┐┬─┐┬ ┬┌┐┌┌─┐┌┬┐
    //   │ ├┬┘├┤ ├┤   ├─┘├┬┘│ ││││├┤  ││
    //   ┴ ┴└─└─┘└─┘  ┴  ┴└─└─┘┘└┘└─┘─┴┘

    if ( quiddityId != 'systemusage' && signal == 'on-tree-pruned' ) {

        // Shmdata Writer
        if ( value[0].indexOf( '.shmdata.writer' ) >= 0 ) {
            var path = value[0].replace( '.shmdata.writer.', '' );
            if (!_.isEmpty(path)) {
                // VU Meters
                this.removeVuMeters( quiddityId );
                this.io.emit( 'removeShmdata', quiddityId, {
                    path: path,
                    type: 'writer'
                } );
            }
        }

        // Shmdata Reader
        if ( value[0].indexOf( '.shmdata.reader' ) >= 0 ) {
            var path = value[0].replace( '.shmdata.reader.', '' );
            if (!_.isEmpty(path)) {
                this.io.emit( 'removeShmdata', quiddityId, {
                    path: path,
                    type: 'reader'
                } );
            }
        }
    }

    //  ┌─┐ ┬ ┬┬┌┬┐┌┬┐┬┌┬┐┬ ┬  ┌─┐┬─┐┌─┐┌─┐┌┬┐┌─┐┌┬┐
    //  │─┼┐│ ││ ││ │││ │ └┬┘  │  ├┬┘├┤ ├─┤ │ ├┤  ││
    //  └─┘└└─┘┴─┴┘─┴┘┴ ┴  ┴   └─┘┴└─└─┘┴ ┴ ┴ └─┘─┴┘

    if ( signal == 'on-quiddity-created' ) {
        // Forward to quiddity manager
        this._onAdded( value[0] );
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

    if ( quiddityId == 'systemusage' && signal == 'on-tree-grafted' ) {
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
    var classes = _.filter( result.classes, function ( quiddityClass ) {
        return !_.contains( this.privateQuiddities, quiddityClass['class name'] );
    }, this );

    // Parse classes
    _.each( classes, this._parseClass, this );

    cb( null, classes );
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
    log.debug( 'Getting property ' + propertyName + ' for class ' + className );
    try {
        var result = JSON.parse( this.switcher.get_property_description_by_class( className, propertyName ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !result || result.error ) {
        return logback( result ? result.error : i18n.t( 'Could not get property __propertyName__ for class __className__', {
            propertyName: propertyName,
            className:    className
        } ) );
    }

    // Parse property
    this._parseProperty( result );

    cb( null, result );
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
    var quiddities = _.filter( quiddDescriptions.quiddities, function ( quiddity ) {
        return !_.contains( this.privateQuiddities, quiddity.class );
    }, this );

    // Parse quiddities
    _.each( quiddities, this._parseQuiddity, this );

    cb( null, quiddities );
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

    // Parse quiddity
    this._parseQuiddity( info );

    return cb( null, info );
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
    try {
        var result = JSON.parse( this.switcher.get_property_description( quiddityId, property ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !result || result.error ) {
        return logback( i18n.t( 'Could not get property description for __quiddityId__ property __property__', {
                quiddityId: quiddityId,
                property:   property
            } ) + ' ' + ( result ? result.error : '' ) )
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
    var self = this;
    if ( quiddityId && property && value != null ) {
        try {
            var result = this.switcher.set_property_value( quiddityId, property, String( value ) );
        } catch ( e ) {
            return logback( e, cb );
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
    } else {
        return logback( i18n.t( 'Missing arguments to set property value' ) + ' ' + quiddityId + ' ' + property + ' ' + value, cb );
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
        return logback( i18n.t( 'Failed to get methods for __quiddityId__', {quiddityId: quiddityId} ) );
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
    try {
        var result = JSON.parse( this.switcher.get_method_description( quiddityId, method ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !result || result.error ) {
        return logback( i18n.t( 'Could not get method description for __quiddityId__ method __method__', {
                quiddityId: quiddityId,
                method:     method
            } ) + ' ' + ( result ? result.error : '' ) )
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
    log.debug( 'Invoking method ' + method + ' of ' + quiddityId + ' with', parameters );
    try {
        var invoke = this.switcher.invoke( quiddityId, method, parameters );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !invoke ) {
        return logback( i18n.t( 'Failed to invoke __method__ on __quiddity__', {
            quiddity: quiddityId,
            method:   method
        } ) );
    }
    cb( null, invoke );
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
        var quiddInfo = JSON.parse( this.switcher.get_quiddity_description( quiddityId ) );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !quiddInfo || quiddInfo.error ) {
        return logback( quiddInfo ? quiddInfo.error : i18n.t( 'Failed to get information for quiddity __quiddityId__', {quiddityId: quiddityId} ) );
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
    log.debug( 'Removing quiddity ' + quiddityId );
    try {
        var result = this.switcher.remove( quiddityId );
    } catch ( e ) {
        return logback( e, cb );
    }
    if ( !result ) {
        return logback( i18n.t( 'Failed to remove quiddity __quiddityId__', {quiddityId: quiddityId} ), cb );
    }
    log.debug( 'Quiddity ' + quiddityId + ' removed.' );
    cb();
};

//  ██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗
//  ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝
//  ██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝
//  ██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝
//  ███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║
//  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝

/*QuiddityManager.prototype.get_description = function ( quiddName, cb ) {
    log.debug( 'get Description quidd', quiddName );

    var quiddDescription = JSON.parse( this.switcher.get_quiddity_description( quiddName ) );
    log.debug( quiddDescription );
    if ( quiddDescription.error ) {
        cb( quiddDescription.error );
        return
    }

    cb( null, quiddDescription );
};*/

/*QuiddityManager.prototype.get_properties_values = function ( quiddName ) {
    var self            = this;
    var propertiesQuidd = this.switcher.get_properties_description( quiddName );
    if ( propertiesQuidd == '' ) {
        log.error( 'failed to get properties description of' + quiddName );
        return;
    }

    propertiesQuidd = JSON.parse( propertiesQuidd ).properties;

    //recover the value set for the properties
    _.each( propertiesQuidd, function ( property, index ) {
        var valueOfproperty = this.switcher.get_property_value( quiddName, property.name );
        if ( property.name == 'shmdata-writers' ) {
            valueOfproperty = JSON.parse( valueOfproperty );
        }
        propertiesQuidd[index].value = valueOfproperty;
    }, this );

    return propertiesQuidd;
};*/

/*QuiddityManager.prototype.get_property_value = function ( quiddName, property, cb ) {
    log.debug( 'Get property value', quiddName, property );
    if ( quiddName && property ) {
        try {
            var property_value = JSON.parse( this.switcher.get_property_value( quiddName, property ) );
        } catch ( e ) {
            var property_value = this.switcher.get_property_value( quiddName, property );
        }
    } else {
        var msg = i18n.t( 'failed to get property value (quiddity __quiddName__ -  property __property__', {
            quiddName: quiddName,
            property:  property
        } );
        cb( msg );
        log.error( msg );
        return;
    }
    cb( null, property_value );
};*/

/*QuiddityManager.prototype.subscribe_info_quidd = function ( quiddName, socketId ) {
    log.debug( 'socketId (' + socketId + ') subscribe info ' + quiddName );
    this.config.subscribe_quidd_info[socketId] = quiddName;
};*/

/*QuiddityManager.prototype.unsubscribe_info_quidd = function ( quiddName, socketId ) {
    log.debug( 'socketId (' + socketId + ') unsubscribe info ' + quiddName );
    delete this.config.subscribe_quidd_info[socketId];
};*/

/*QuiddityManager.prototype.set_property_value_of_dico = function ( property, value, callback ) {
    var currentValueDicoProperty = JSON.parse( this.switcher.invoke( 'dico', 'read', [property] ) );
    if ( currentValueDicoProperty ) {
        currentValueDicoProperty[currentValueDicoProperty.length] = value;
    } else {
        var currentValueDicoProperty = [value];
    }

    this.switcher.set_property_value( 'dico', property, JSON.stringify( currentValueDicoProperty ) );
    this.io.emit( 'setDicoValue', property, value );
    callback( 'ok' );
};*/

/*QuiddityManager.prototype.remove_property_value_of_dico = function ( property, name ) {
    var self                      = this;
    var currentValuesDicoProperty = JSON.parse( this.switcher.invoke( 'dico', 'read', [property] ) );
    var newValuesDico             = [];
    _.each( currentValuesDicoProperty, function ( value ) {
        if ( value.name != name ) {
            newValuesDico.push( value );
        }
    } );

    if ( property == 'controlDestinations' ) {
        /!* parse all quidds for remove mapper associate *!/
        var quidds = JSON.parse( this.switcher.get_quiddities_description() ).quiddities;

        /!* Remove quiddity sink base on quidd removed *!/
        _.each( quidds, function ( quidd ) {
            if ( quidd.name.indexOf( 'mapper' ) >= 0 && quidd.name.indexOf( name ) >= 0 ) {
                this.switcher.remove( quidd.name );
            }
        }, this );
    }

    log.debug( 'Remove property', property, name );

    this.switcher.invoke( 'dico', 'update', [property, JSON.stringify( newValuesDico )] );
    this.io.emit( 'removeValueOfPropertyDico', property, name );
};*/

module.exports = QuiddityManager;