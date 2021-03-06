'use strict';

var _   = require( 'underscore' );
var log = require( '../lib/logger' );

/**
 * Constructor
 *
 * @param switcherController
 * @constructor
 */
function QuiddityManager( switcherController ) {
    this.switcherController = switcherController;
    this.config             = this.switcherController.config;
    this.switcher           = this.switcherController.switcher;
    this.io                 = this.switcherController.io;


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
        //'systemusage',
        'SOAPcontrolServer'
    ];

    /**
     * Allowed shmdata types
     *
     * @type {string[]}
     */
    this.shmdataTypes = ['reader', 'writer'];

    /**
     * Changed properties
     *
     * @type {object[]}
     */
    this.changedProperties = {};
}

/**
 * Initialize
 */
QuiddityManager.prototype.initialize = function () {
    // Watch changed properties
    setInterval( _.bind( this.publishChangedProperties, this ), 1000 / 30 );
};

//  ██████╗  █████╗ ██████╗ ███████╗███████╗██████╗ ███████╗
//  ██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝
//  ██████╔╝███████║██████╔╝███████╗█████╗  ██████╔╝███████╗
//  ██╔═══╝ ██╔══██║██╔══██╗╚════██║██╔══╝  ██╔══██╗╚════██║
//  ██║     ██║  ██║██║  ██║███████║███████╗██║  ██║███████║
//  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝

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
        case 'int64':
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
        case 'fraction':
            //TODO: Complete
            /*{
             name:                  'Shortest interframe time',
             writable:              'true',
             type:                  'fraction',
             'minimum numerator':   '0',
             'maximum numerator':   '1',
             'minimum denominator': '2147483647',
             'maximum denominator': '1',
             'default numerator':   '1',
             'default denominator': '1',
             value:                 undefined,
             default:               undefined,
             id:                    'timebase',
             description:           'Fraction of one second that is the shortest interframe time - normally left as zero which will default to the framerate',
             order:                 820
             }*/
            property.value = property.default = property['default numerator'] + '/' + property['default denominator'];
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
    property.parent   = _.isEmpty( property.parent ) ? null : property.parent;
    property.writable = property.writable == 'true';

    delete property['default value'];

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
    method.parent   = _.isEmpty( method.parent ) ? null : method.parent;
    method.returnType        = method['return type'];
    method.returnDescription = method['return description'];

    delete method['default value'];
    delete method['return type'];
    delete method['return description'];

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
 * Fill quiddity with its properties, methods and tree
 *
 * @param {Quiddity} quiddity
 * @param {Object} config
 * @returns {Quiddity}
 * @private
 */
QuiddityManager.prototype._fillQuiddity = function ( quiddity, config ) {

    // Get all properties
    if ( !config || config.properties ) {
        try {
            // Fill properties in the quiddity object
            quiddity.properties = this.getProperties( quiddity.id );
        } catch ( e ) {
            log.error( 'Error getting properties for quiddity', quiddity.id, e );
        }
    }

    // Get all methods
    if ( !config || config.methods ) {
        try {
            // Fill methods in the quiddity object
            quiddity.methods = this.getMethods( quiddity.id );
        } catch ( e ) {
            log.error( 'Error getting methods for quiddity', quiddity.id, e );
        }
    }

    // Get tree
    if ( !config || config.tree ) {
        try {
            // Fill tree in the quiddity object
            quiddity.tree = this.getTreeInfo( quiddity.id, '.' );
        } catch ( e ) {
            log.error( 'Error getting tree for quiddity', quiddity.id, e );
        }
    }

    return quiddity;
};

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
        var quiddity = this.switcher.get_quiddity_description( quiddityId );
    } catch ( e ) {
        return log.error( 'Error while retrieving quiddity information', quiddityId, e );
    }
    if ( !quiddity ) {
        return log.error( 'Failed to get information for quiddity', quiddityId );
    } else if ( quiddity.error ) {
        return log.error( 'Failed to get information for quiddity', quiddityId, quiddity.error );
    }

    log.debug( quiddity );

    // Only proceed if it's not on of the 'private' quiddities, they don't matter to the client
    if ( !_.contains( this.privateQuiddities, quiddity.class ) ) {

        // Subscribe to property/method add/remove signals
        this.switcher.subscribe_to_signal( quiddityId, 'on-property-added' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-property-removed' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-method-added' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-method-removed' );

        // SOAP Control Client
        if ( quiddity.class == 'SOAPcontrolClient' ) {
            log.debug( 'SOAP Control Client, subscribing to on-connection-tried' );
            this.switcher.subscribe_to_signal( quiddityId, 'on-connection-tried' );
        }

        // Subscribe to this quiddity's tree modifications
        this.switcher.subscribe_to_signal( quiddityId, 'on-tree-grafted' );
        this.switcher.subscribe_to_signal( quiddityId, 'on-tree-pruned' );

        // Fill with properties, methods and tree
        this._fillQuiddity( quiddity );

        // Subscribe to properties
        if ( quiddity.properties ) {
            _.each( quiddity.properties, function ( property ) {
                log.debug( 'Subscribing to property ' + property.name + ' (' + property.id + ') of ' + quiddityId );
                this.switcher.subscribe_to_property( quiddityId, property.id );
            }, this );
        }

        // Broadcast creation message including the creator's socketId so that the interface can know if they created the quiddity
        this.io.emit( 'quiddity.created', quiddity, this.quidditySocketMap[quiddityId] );
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
    try {
        this.switcherController.controlManager.removeMappingsByQuiddity( quiddityId );
    } catch ( e ) {
        log.error( 'Error while removing quiddity mappings', quiddityId, e );
    }

    // Broadcast to clients
    this.io.emit( 'quiddity.removed', quiddityId );
};

/**
 * Tree Grafted Handler
 *
 * @param quiddityId
 * @param path
 * @private
 */
QuiddityManager.prototype._onTreeGrafted = function ( quiddityId, path ) {
    var graftedPath = path.split( '.' );
    // Remove the first empty value, because paths start with a dot
    graftedPath.shift();

    // Shmdatas
    if ( graftedPath[0] == 'shmdata' && graftedPath.length >= 3 ) {
        var graftedShmdataType = graftedPath[1];
        var graftedShmdataPath = graftedPath[2];
        if ( !_.isEmpty( graftedShmdataPath ) && _.contains( this.shmdataTypes, graftedShmdataType ) ) {

            //TODO: Merge into a more unified tree management
            var key = graftedPath[graftedPath.length - 1];
            if ( key == 'byte_rate' ) {
                // This is a special case done to send less data over the network
                // It should eventually be merged into a better tree management
                var value = this.getTreeInfo( quiddityId, path );
                this.io.emit( 'shmdata.update.rate', quiddityId, graftedShmdataType + '.' + graftedShmdataPath, parseInt( value ) );
            } else {
                try {
                    var shmdataInfo = this.getTreeInfo( quiddityId, '.shmdata.' + graftedShmdataType + '.' + graftedShmdataPath );
                } catch ( e ) {
                    log.error( e );
                }
                if ( !shmdataInfo || !_.isObject( shmdataInfo ) || shmdataInfo.error ) {
                    log.error( shmdataInfo ? shmdataInfo.error : 'Could not get shmdata writer info' );
                } else {
                    this._parseShmdata( shmdataInfo );
                    shmdataInfo.path = graftedShmdataPath;
                    shmdataInfo.type = graftedShmdataType;
                    this.io.emit( 'shmdata.update', quiddityId, shmdataInfo );
                }
            }
        }
    } else {
        //TODO: Be more granular about this once switcher's tree can return individual values
        var tree = this.getTreeInfo( quiddityId, '.' );
        this.io.emit( 'quiddity.tree.updated', quiddityId, tree );
    }
};

/**
 * Tree Pruned Handler
 *
 * @param quiddityId
 * @param value
 * @private
 */
QuiddityManager.prototype._onTreePruned = function ( quiddityId, value ) {
    var prunedPath = value.split( '.' );
    prunedPath.shift();

    // Shmdatas
    if ( prunedPath[0] == 'shmdata' && prunedPath.length >= 2 ) {
        var prunedShmdataType = prunedPath[1];
        if ( _.contains( this.shmdataTypes, prunedShmdataType ) ) {
            var prunedShmdataPath = ( prunedPath.length >= 3 ) ? prunedPath[2] : null;
            if ( prunedShmdataPath ) {
                // A path was provided, remove only that shmdata
                this.io.emit( 'shmdata.remove', quiddityId, {
                    type: prunedShmdataType,
                    path: prunedShmdataPath
                } );
            } else {
                // No path was provided, remove all shmdata of the specified type
                this.io.emit( 'shmdata.remove', quiddityId, {
                    type: prunedShmdataType
                } );
            }
        }
    } else {
        //TODO: Be more granular about this once switcher's tree can return individual values
        var value = this.getTreeInfo( quiddityId, '.' );
        this.io.emit( 'quiddity.tree.updated', quiddityId, value );
    }
};

/**
 * Property Added Handler
 *
 * @param quiddityId
 * @param property
 * @private
 */
QuiddityManager.prototype._onPropertyAdded = function ( quiddityId, property ) {
    log.debug( 'Property added', quiddityId, property );
    this.switcher.subscribe_to_property( quiddityId, property );
    var propertyDescription = this.getPropertyDescription( quiddityId, property );
    if ( propertyDescription ) {
        this.io.emit( 'quiddity.property.added', quiddityId, propertyDescription );
    } else {
        log.warn( 'Could not get property description', quiddityId, property );
    }
};

/**
 * Property Removed Handler
 *
 * @param quiddityId
 * @param property
 * @private
 */
QuiddityManager.prototype._onPropertyRemoved = function ( quiddityId, property ) {
    log.debug( 'Property removed', quiddityId, property );
    this.io.emit( 'quiddity.property.removed', quiddityId, property );
};

/**
 * Method Added Handler
 *
 * @param quiddityId
 * @param method
 * @private
 */
QuiddityManager.prototype._onMethodAdded = function ( quiddityId, method ) {
    log.debug( 'Method added', quiddityId, method );
    var methodDescription = this.getMethodDescription( quiddityId, method );
    if ( methodDescription ) {
        this.io.emit( 'quiddity.method.added', quiddityId, methodDescription );
    } else {
        log.warn( 'Could not get method description', quiddityId, method );
    }
};

/**
 * Method Removed Handler
 *
 * @param quiddityId
 * @param method
 * @private
 */
QuiddityManager.prototype._onMethodRemoved = function ( quiddityId, method ) {
    log.debug( 'Method removed', quiddityId, method );
    this.io.emit( 'quiddity.method.removed', quiddityId, method );
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

    if ( this.changedProperties[quiddityId] == null ) {
        this.changedProperties[quiddityId] = {};
    }
    this.changedProperties[quiddityId][property] = value;
};

/**
 * Publishes the changed properties
 * This is done at a fixed rate to prevent large number of changes of the same property
 * overflowing the client with updates
 */
QuiddityManager.prototype.publishChangedProperties = function () {
    _.each( this.changedProperties, function ( properties, quiddityId ) {
        _.each( properties, function ( value, property ) {
            // We have to get the property info in order to parse its value correctly
            // This looks like it isn't necessary but we need the description to handle the value type
            try {
                var propertyInfo = this.switcher.get_property_description( quiddityId, property );
            } catch ( e ) {
                return log.error( e );
            }
            if ( !propertyInfo || !_.isObject( propertyInfo ) || propertyInfo.error ) {
                return log.error( 'Could not get property description for', quiddityId, property, value, propertyInfo ? propertyInfo.error : '' );
            }

            // Parse property
            this._parseProperty( propertyInfo );

            // Use the parsed value from now on
            value = propertyInfo.value;

            // Send to clients
            this.io.emit( 'propertyChanged', quiddityId, property, value );
        }, this );
    }, this );
    this.changedProperties = {};
};

/**
 * Switcher Signal Callback
 *
 * @param quiddityId
 * @param signal
 * @param value
 */
QuiddityManager.prototype.onSwitcherSignal = function ( quiddityId, signal, value ) {
    // We exclude system usage and shmdata from debug because it dispatches every second
    if ( quiddityId != this.config.systemUsage.quiddName && value[0].indexOf( '.shmdata' ) != 0 ) {
        log.debug( 'Signal:', quiddityId + '.' + signal + '=' + value );
    } else {
        log.verbose( 'Signal:', quiddityId + '.' + signal + '=' + value );
    }

    switch ( signal ) {
        case 'on-tree-grafted':
            this._onTreeGrafted( quiddityId, value[0] );
            break;

        case  'on-tree-pruned':
            this._onTreePruned( quiddityId, value[0] );
            break;

        case 'on-quiddity-created':
            this._onCreated( value[0] );
            break;

        case 'on-quiddity-removed':
            this._onRemoved( value[0] );
            break;

        case 'on-property-added' :
            this._onPropertyAdded( quiddityId, value[0] );
            break;

        case 'on-property-removed':
            this._onPropertyRemoved( quiddityId, value[0] );
            break;

        case 'on-method-added' :
            this._onMethodAdded( quiddityId, value[0] );
            break;

        case 'on-method-removed':
            this._onMethodRemoved( quiddityId, value[0] );
            break;

        default:
            // We could send other signals to the client but we'll stay silent for now
            //this.io.emit( 'quiddity.signal', quiddityId, signal, value[0] );
            break;
    }
};

//  ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
//  ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
//  ██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
//  ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
//  ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
//  ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝

/**
 * Verify if a quiddity exists
 *
 * @param {String} quiddityId - Id of the quiddity
 * @returns {Boolean} If the quiddity exists or not
 */
QuiddityManager.prototype.exists = function ( quiddityId ) {
    return this.switcher.has_quiddity( quiddityId );
};

/**
 * Create Quiddity
 *
 *  @param {string} className The class of the quiddity
 *  @param {string} quiddityName The name (id) of the quiddity
 *  @param {string} [socketId] Id Socket (socket.io) of the user ask to create the quiddity
 */
QuiddityManager.prototype.create = function ( className, quiddityName, socketId ) {
    log.info( 'Creating quiddity ' + className + ' named ' + quiddityName );

    // Create the quiddity
    var result = _.isEmpty( quiddityName ) ? this.switcher.create( className ) : this.switcher.create( className, quiddityName );

    var quiddityDescription = null;
    if ( result ) {
        var quiddityId = result;
        if ( socketId ) {
            // Keep a history of who created what
            //TODO Move that into the client
            this.quidditySocketMap[quiddityId] = socketId;
        }
        quiddityDescription = this.getQuiddityDescription( quiddityId );
    }

    return quiddityDescription;
};

/**
 * Remove quiddity
 * Removes the quiddity
 *
 * @param {string} quiddityId The name (id) of the quiddity
 * @returns {Boolean} Success
 */
QuiddityManager.prototype.remove = function ( quiddityId ) {
    log.info( 'Removing quiddity ' + quiddityId );
    var result = this.switcher.remove( quiddityId );
    if ( result ) {
        log.debug( 'Quiddity ' + quiddityId + ' removed.' );
    } else {
        log.warn( 'Failed to remove quiddity ' + quiddityId );
    }

    return result;
};

/**
 * Get quiddity classes
 *
 * @returns {Array} List of classes and their descriptions
 */
QuiddityManager.prototype.getQuiddityClasses = function () {
    log.info( 'Getting quiddity classes' );

    var result = this.switcher.get_classes_doc();
    if ( result && result.error ) {
        throw new Error( result.error );
    }

    var classes = [];
    if ( result && result.classes && _.isArray( result.classes ) ) {
        // Filter out private quiddities
        classes = _.filter( result.classes, function ( quiddityClass ) {
            return !_.contains( this.privateQuiddities, quiddityClass['class name'] );
        }, this );
    }

    return classes;
};

/**
 * Get Quiddities
 *
 * @param {Object} config
 * @returns {Array} List of quiddities
 */
QuiddityManager.prototype.getQuiddities = function ( config ) {
    log.info( 'Getting quiddities' );

    var result = this.switcher.get_quiddities_description();
    if ( result && result.error ) {
        throw new Error( result.error );
    }

    var quiddities = [];
    if ( result && result.quiddities && _.isArray( result.quiddities ) ) {
        quiddities = _.filter( result.quiddities, function ( quiddity ) {
            return !_.contains( this.privateQuiddities, quiddity.class );
        }, this );
    }

    // Fill quiddities with their properties, methods and tree before sending
    _.each( quiddities, function ( quiddity ) {
        this._fillQuiddity( quiddity, config );
    }, this );

    return quiddities;
};

/**
 * Get quiddity description
 *
 * @param {String} quiddityId Quiddity for which we want to retrieve the description
 * @returns {Object} Object describing the quiddity
 */
QuiddityManager.prototype.getQuiddityDescription = function ( quiddityId ) {
    log.info( 'Getting quiddity description for quiddity ' + quiddityId );

    var result = this.switcher.get_quiddity_description( quiddityId );
    if ( result && result.error ) {
        throw new Error( result.error );
    }

    var quiddityDescription = {};
    if ( result && !_.isEmpty( result ) && _.isObject( result ) && !_.isArray( result ) ) {
        quiddityDescription = result;
    }

    return quiddityDescription;
};

/**
 * Get quiddity tree information
 *
 * @param {String} quiddityId Quiddity for which we want to retrieve the tree information
 * @param {String} [path] Branch/leaf path to query inside the tree
 * @returns {Object} Information contained in the tree or an empty object if nothing was found
 */
QuiddityManager.prototype.getTreeInfo = function ( quiddityId, path ) {
    log.verbose( 'Getting quiddity tree for: ' + quiddityId + ' ' + path );
    if ( path == null ) {
        path = '.';
    }
    var result = this.switcher.get_info( quiddityId, path );
    if ( result && result.error ) {
        throw new Error( result.error );
    }

    return ( result && _.isObject( result ) ) ? result : null;
};

/**
 * Get properties
 *
 * @param {String} quiddityId Quiddity for which we want to retrieve the properties
 * @returns {Array} Array of properties for the passed quiddity
 */
QuiddityManager.prototype.getProperties = function ( quiddityId ) {
    log.info( 'Getting properties for quiddity: ' + quiddityId );

    var result = this.switcher.get_properties_description( quiddityId );
    if ( result && result.error ) {
        throw new Error( result.error );
    }
    var properties = [];
    if ( result && result.properties && _.isArray( result.properties ) ) {
        properties = result.properties;
        // Parse properties
        _.each( result.properties, this._parseProperty, this );
    }

    return properties;
};

/**
 * Get property description
 *
 * @param {String} quiddityId Quiddity for which we want to retrieve the property description
 * @param {String} property Property for which we want the description
 * @returns {Object} Object describing the property
 */
QuiddityManager.prototype.getPropertyDescription = function ( quiddityId, property ) {
    log.info( 'Getting property description for quiddity ' + quiddityId + ' property ' + property );

    var result = this.switcher.get_property_description( quiddityId, property );
    if ( result && result.error ) {
        throw new Error( result.error );
    }

    var propertyDescription = {};
    if ( result && !_.isEmpty( result ) && _.isObject( result ) && !_.isArray( result ) ) {
        propertyDescription = result;
        this._parseProperty( propertyDescription );
    }

    return propertyDescription;
};

/**
 * Get property value
 *
 * @param {String} quiddityId Quiddity for which we want to retrieve the property value
 * @param {String} property Property for which we want the value
 * @returns {*} Property value
 */
QuiddityManager.prototype.getPropertyValue = function ( quiddityId, property ) {
    log.info( 'Getting property value for quiddity ' + quiddityId + ' property ' + property );

    var result = this.switcher.get_property_value( quiddityId, property );
    if ( result && result.error ) {
        throw new Error( result.error );
    }
    return result;
};

/**
 * Set property value
 *
 * @param {String} quiddityId Quiddity for which we want to retrieve the property description
 * @param {String} property Property for which we want the description
 * @param {*} value Value to set the property to
 * @returns {Boolean} Returns true if the operation was successful
 */
QuiddityManager.prototype.setPropertyValue = function ( quiddityId, property, value ) {
    log.info( 'Setting property ' + property + ' of ' + quiddityId + ' to ' + value );

    var result = this.switcher.set_property_value( quiddityId, property, String( value ) );
    if ( result && result.error ) {
        throw new Error( result.error );
    }

    return result;
};

/**
 * Get Methods
 *
 * @param {String} quiddityId Quiddity for which we want to retrieve the methods
 * @returns {Array} Methods for the quiddity
 */
QuiddityManager.prototype.getMethods = function ( quiddityId ) {
    log.info( 'Getting methods for quiddity ' + quiddityId );

    var result = this.switcher.get_methods_description( quiddityId );
    if ( result && result.error ) {
        throw new Error( result.error );
    }

    var methods = [];
    if ( result && result.methods && _.isArray( result.methods ) ) {
        methods = result.methods;

        // Parse methods
        _.each( methods, this._parseMethod, this );
    }

    return methods;
};

/**
 * Get method description
 *
 * @param {String} quiddityId Quiddity for which we want to retrieve the method description
 * @param {String} method Method for which we want the description
 * @returns {*}
 */
QuiddityManager.prototype.getMethodDescription = function ( quiddityId, method ) {
    log.info( 'Getting method description for quiddity ' + quiddityId + ' method ' + method );

    var result = this.switcher.get_method_description( quiddityId, method );
    if ( result && result.error ) {
        throw new Error( result.error );
    }

    var methodDescription = {};
    if ( result && !_.isEmpty( result ) && _.isObject( result ) && !_.isArray( result ) ) {
        methodDescription = result;

        // Parse method
        this._parseMethod( result );
    }

    return methodDescription;
};

/**
 * Invoke method on quiddity
 *
 * @param quiddityId
 * @param method
 * @param parameters
 * @returns {*}
 */
QuiddityManager.prototype.invokeMethod = function ( quiddityId, method, parameters ) {
    log.info( 'Invoking method ' + method + ' of ' + quiddityId + ' with', parameters );

    if ( _.isEmpty( parameters ) ) {
        parameters = [];
    } else if ( !_.isArray( parameters ) ) {
        parameters = [parameters];
    }

    //TODO: Return values are unclear, does an empty string means an error occurred?
    var result = this.switcher.invoke( quiddityId, method, parameters );

    return result;
};

module.exports = QuiddityManager;