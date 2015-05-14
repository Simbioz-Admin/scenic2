"use strict";

var _    = require( 'underscore' );
var i18n = require( 'i18next' );
var log  = require( '../lib/logger' );

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
}

/**
 * Binds a new client socket
 *
 * @param socket
 */
QuiddityManager.prototype.bindClient = function ( socket ) {
    socket.on( "create", this.create.bind( this ) );
    socket.on( "get_quiddity_description", this.get_description.bind( this ) );
    socket.on( "get_info", this.get_info.bind( this ) );
    socket.on( "get_properties_description", this.get_properties_description.bind( this ) );
    socket.on( "get_methods_description", this.get_methods_description.bind( this ) );
    socket.on( "get_method_description", this.get_method_description.bind( this ) );
    socket.on( "get_property_description", this.get_property_description.bind( this ) );
    socket.on( "get_property_value", this.get_property_value.bind( this ) );
    socket.on( "set_property_value", this.set_property_value.bind( this ) );
    socket.on( "get_property_by_class", this.get_property_by_class.bind( this ) );
    socket.on( "remove", this.remove.bind( this ) );
    socket.on( "invoke", this.invoke.bind( this ) );
    socket.on( "subscribe_info_quidd", this.subscribe_info_quidd.bind( this ) );
    socket.on( "unsubscribe_info_quidd", this.unsubscribe_info_quidd.bind( this ) );
    socket.on( "setPropertyValueOfDico", this.set_property_value_of_dico.bind( this ) );
    socket.on( "removeValuePropertyOfDico", this.remove_property_value_of_dico.bind( this ) );
};

/**
 *  @function create
 *  @description call when a user ask to creating a quiddity
 *  @param {string} className The class of the quiddity
 *  @param {string} quiddName The name (id) of the quiddity
 *  @param {string} socketId Id Socket (socket.io) of the user ask to create the quiddity
 */
QuiddityManager.prototype.create = function ( className, quiddName, socketId, cb ) {
  if ( !cb ) {
    cb = socketId;
  } //its not always a user ask for create a quidd

    quiddName = (quiddName ? this.switcher.create( className, quiddName ) : this.switcher.create( className ));
    if ( quiddName ) {

        /* we stock id of socket and name of quidd because we want to alert the user
         client side when the quiddity is created for show the properties */

        log.debug( "quiddity " + quiddName + " (" + className + ") created." );

        this.config.listQuiddsAndSocketId[quiddName] = socketId;
        var quiddInfo                                = JSON.parse( this.switcher.get_quiddity_description( quiddName ) );
        cb( null, quiddInfo );

    } else {
        var msgError = i18n.t( "failed to create __className__ maybe this name is already used?", {className: className} );
        log.error( msgError );
        cb( msgError );
    }

};

/**
 *  @function remove
 *  @description removes the quiddity and all those associated with it (eg ViewMeter, preview, etc. ..)
 *  @param {string} quiddName The name (id) of the quiddity
 */
QuiddityManager.prototype.remove = function ( quiddName ) {

    if ( this.switcher.remove( quiddName ) ) {
        log.debug( "quiddity " + quiddName + " is removed." );
    } else {
        log.error( "failed to remove " + quiddName );
    }
};

QuiddityManager.prototype.removeElementsAssociateToQuiddRemoved = function ( quiddName ) {
    var self   = this;
    log.debug( "remove quidds associate to quidd removed", quiddName );
    var quidds = JSON.parse( this.switcher.get_quiddities_description() ).quiddities;

  if ( !quidds ) {
    return log.error( "failed remove quiddity " + quiddName );
  }

    this.removeConrolByQuiddParent( quiddName );

    /* Remove quiddity sink base on quidd removed  or vumeter */
    _.each( quidds, function ( quidd ) {
      if ( quidd.name.indexOf( quiddName + "-sink" ) != -1 ) {
        this.switcher.remove( quidd.name );
      }
      if ( quidd.name.indexOf( "vumeter_" ) >= 0 && quidd.name.indexOf( quiddName ) >= 0 ) {
        this.switcher.remove( quidd.name );
      }
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

QuiddityManager.prototype.set_property_value = function ( quiddName, property, value, cb ) {
    var self = this;
    //check for remove shmdata when set property started to false
    if ( property == "started" && value == "false" ) {

        //remove vumemeter associate with quiddity
        var shmdatas = JSON.parse( this.switcher.get_property_value( quiddName, "shmdata-writers" ) );
        if ( shmdatas && !shmdatas.error ) {
            shmdatas = shmdatas.shmdata_writers;
            _.each( shmdatas, function ( shmdata, index ) {
                log.debug( "remove vumeter : vumeter_" + shmdata.path );
                this.switcher.remove( 'vumeter_' + shmdata.path );
            }, this );
        }

        //remove shmdata of rtp
        var shmdatas = JSON.parse( this.switcher.get_property_value( quiddName, "shmdata-writers" ) ).shmdata_writers;
        _.each( shmdatas, function ( shmdata ) {
            // console.log("remove data stream", shmdata.path);
            //var remove = this.switcher.invoke("defaultrtp","remove_data_stream", [shmdata.path]);
        } );

    }

    if ( quiddName && property && value ) {
        var ok = this.switcher.set_property_value( quiddName, property, String( value ) );
        if ( ok ) {
            log.debug( "the porperty " + property + " of " + quiddName + "is set to " + value );
            cb( null, property, value );

        } else {
            log.error( "failed to set the property " + property + " of " + quiddName );
            this.io.emit( "msg", "error", "the property " + property + " of " + quiddName + " is not set" );
        }
    } else {
        log.error( "missing arguments for set property value :", quiddName, property, value );
    }
};

QuiddityManager.prototype.get_info = function ( quiddName, path, cb ) {
    log.debug( "Getting quiddity information for: " + quiddName );
    var info = JSON.parse( this.switcher.get_info( quiddName, path ) );
    return cb( info );
};

QuiddityManager.prototype.get_property_by_class = function ( className, propertyName, callback ) {
    log.debug( "Getting property by class", className, propertyName );
    var propertyByClass = JSON.parse( this.switcher.get_property_description_by_class( className, propertyName ) );

    if ( propertyByClass && propertyByClass.error ) {
        log.error( propertyByClass.error + "(property : " + propertyName + ", class : " + className + ")" );
        return;
    }
    callback( propertyByClass );
};

QuiddityManager.prototype.get_property_description = function ( quiddName, property, callback ) {
    var property_description = JSON.parse( this.switcher.get_property_description( quiddName, property ) );
    if ( property_description && property_description.error ) {
        log.error( property_description.error + "(property : " + property + ", quiddity : " + quiddName + ")" );
        return;
    }
    callback( property_description );
};

QuiddityManager.prototype.get_properties_values = function ( quiddName ) {
    var self = this;
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

QuiddityManager.prototype.get_properties_description = function ( quiddName, cb ) {
    var properties_description = JSON.parse( this.switcher.get_properties_description( quiddName ) ).properties,
        properties_to_send     = {};

    if ( properties_description && properties_description.error ) {
        var msg = properties_description.error + "(quiddity : " + quiddName + ")";
        cb( msg );
        log.error( msg );
        return;
    }

    //re-order properties for get key = name property
    _.each( properties_description, function ( property ) {
        properties_to_send[property.name] = property;
    } );
    cb( null, properties_to_send );
};

QuiddityManager.prototype.get_methods_description = function ( quiddName, cb ) {
    var methods = JSON.parse( this.switcher.get_methods_description( quiddName ) ).methods;
    if ( !methods ) {
        var msg = i18n.t( "failed to get methods description __quiddName__", {
            quiddName: quiddName
        } );
        return;
    }

    var methods_to_send = {};
    _.each( methods, function ( method ) {
        methods_to_send[method.name] = method;
    } );

    cb( null, methods_to_send );
};

QuiddityManager.prototype.get_method_description = function ( quiddName, method, cb ) {
    var descriptionJson = JSON.parse( this.switcher.get_method_description( quiddName, method ) );
    if ( !descriptionJson ) {
        var msg = i18n.t( "failed to get __method__ method description __quiddName", {
            method:    method,
            quiddName: quiddName
        } );
        cb( msg, err );
        log.error( msg );
        return;
    }
    cb( null, descriptionJson );
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

QuiddityManager.prototype.invoke = function ( quiddName, method, parameters, cb ) {
    var invoke = this.switcher.invoke( quiddName, method, parameters );
    log.debug( "the method " + method + " of " + quiddName + " is invoked with " + parameters );
    if ( !invoke ) {
        var msgError = i18n.t( "failed to invoke __quiddName__ method __method__", {
            quiddName: quiddName,
            method:    method
        } );
        log.error( msgError );
        return cb( msgError );
    }
  if ( cb ) {
    cb( null, invoke );
  }

  if ( method == "remove_udp_stream_to_dest" ) {
    this.io.emit( "remove_connection", invoke, quiddName, parameters );
  }

    //this.io.emit("invoke", invoke, quiddName, method, parameters);
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
    var currentValuesDicoProperty = JSON.parse( this.switcher.invoke( "dico", "read", ['controlProperties'] ) );
    _.each( currentValuesDicoProperty, function ( control ) {
        if ( control.quiddName == quiddParent ) {
            remove_property_value_of_dico( "controlProperties", control.name );
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

    if ( property == "controlProperties" ) {
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