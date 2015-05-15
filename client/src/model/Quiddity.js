"use strict";

define( [
    'underscore',
    'backbone',
    'async',
    'lib/socket',
    'model/base/ScenicModel',
    'model/quiddity/Properties',
    'model/quiddity/Methods',
    'model/quiddity/Shmdatas'
], function ( _, Backbone, async, socket, ScenicModel, Properties, Methods, Shmdatas ) {

    /**
     *  @constructor
     *  @augments ScenicModel
     */

    var QuiddModel = ScenicModel.extend( {
        idAttribute: 'name',
        defaults:    {
            "name":             null,
            "newName":          null, // Name is the is we need to separate the requested name
            "class":            null,
            "category":         null,
            "long name":        null,
            "description":      null,
            "properties":       new Properties(),
            "methods":          new Methods(),
            "encoder_category": null,
            "shmdatas":         new Shmdatas(),
            "view":             null
        },


        /**
         *  Function executed when the model quiddity is created
         *  It's used for created a view associate to the model
         *  This view need to know if it's in table controler or transfer and if it's a source or destination
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply( this, arguments );

            socket.on( "remove", _.bind( this._onRemoved, this ) );
            socket.on( "signals_properties_info", _.bind( this._onSignalsPropertiesInfo, this ) );
            socket.on( "signals_properties_value", _.bind( this._onSignalsPropertiesValue, this ) );

            this.get( 'properties' ).quiddity = this;
            this.get( 'methods' ).quiddity = this;
            this.get( 'shmdatas' ).quiddity = this;
            if ( !this.isNew() ) {
                this.get( 'properties' ).fetch();
                this.get( 'methods' ).fetch();
                this.get( 'shmdatas' ).fetch();
            }
        },

        /**
         * Delete Handler
         *
         * @param {String} quiddityId
         */
        _onRemoved: function ( quiddityId ) {
            if ( this.id == quiddityId ) {
                this.trigger( 'destroy', this, this.collection );
            }
        },

        /**
         * Signals Property Info Handler
         *
         * @param {string} prop The type of event on property or method
         * @param {string} quiddName The name of the quiddity
         * @param {string} name The name of the property or method
         */
        _onSignalsPropertiesInfo: function ( prop, quiddName, name ) {
            if ( this.id == quiddName ) {
                if ( prop == "on-property-removed" ) {
                    this.removeProperty( name[0] );
                }
                if ( prop == "on-property-added" ) {
                    this.addProperty( name[0] );
                }
                if ( prop == "on-method-added" ) {
                    this.addMethod( name[0] );
                }
                if ( prop == "on-method-removed" ) {
                    this.removeMethod( name[0] );
                }
            }
        },

        /**
         *  Signals Property Value Handler
         *
         *  @param {string} quiddName The name of the quiddity
         *  @param {string} prop The name of the property or method
         *  @param {string} value The value of the property
         */
        _onSignalsPropertiesValue: function ( quiddName, prop, value ) {
            if ( prop != "byte-rate" && this.id == quiddName ) {
                console.log( quiddName, prop, value );
                var properties = this.get( "properties" );
                //TODO: Make this a collection/model too
                if ( properties.length == 0 ) {
                    this.get( 'properties' ).push( {name: prop, value: value} );
                } else {
                    this.get( "properties" )[prop]["default value"] = value;
                }
                this.trigger( "update:value", prop );
            }
        },


        //
        //
        //
        //
        //

        /**
         *  Edit Quiddity
         *  Put the quiddity in edit mode by updating its properties and descriptions,
         *  then subscribing to get real-time updates
         */
        edit: function () {
            var self = this;
            async.series([
                function( callback ) {
                    self.getProperties( callback );
                },
                function( callback ) {
                    self.getMethodsDescription( callback );
                }
            ], function( error ) {
                if ( error ) {
                    console.error( error );
                    return;
                }
                socket.emit( "subscribe_info_quidd", self.id, socket.id );
                self.trigger('edit', self);
            });
        },


        /**
         *  Allows to remove a specific quiddity. We also check if there are quiddity of control associated with the quiddity to also remove
         * TODO: Get this out of here
         */

        askDelete: function () {
            var self = this;

            //TODO: Get the confirmation in the UI
            views.global.confirmation( function ( ok ) {
                if ( ok ) {
                    self.destroy();
                }
            } );
        },


        

        /*
         *  Set the property value of the quiddity
         *  @param {string} property The name of the property
         *  @param {string} value The value of the property
         *  @param {function} callback Confirms that the property defined
         *  @TODO : REMOVE THIS FUNCTION FOR CALL DIRECTLY
         */

        setPropertyValue: function ( property, value, cb ) {
            var that = this;
            socket.emit( "set_property_value", this.get( "name" ), property, value, function ( err ) {
                if ( err ) {
                    return views.global.notification( "error", err );
                }
                if ( cb ) {
                    cb( "ok" );
                }
            } );
        },


        /*
         *  Get and set the properties of a quiddity
         */

        getProperties: function ( callback ) {
            var that = this;
            socket.emit( "get_properties_description", this.get( "name" ), function ( err, properties_description ) {
                if ( err ) {
                    views.global.notification( "error", err );
                }
                that.set( "properties", properties_description );
                callback( properties_description );
            } );
        },


        /*
         *  Remove a specific property
         *  This function is called by the server when a property is removed
         *  @param {string} property The name of the property
         */

        removeProperty: function ( property ) {
            delete this.get( "properties" )[property];
            /* trigger a model used to trigger a function of the view that is associated */
            this.trigger( "remove:property", property );
        },


        /*
         *  Add a specific property
         *  This function is called by the server when a property is added
         *  @param {string} property The name of the property
         */

        addProperty: function ( property ) {
            var that = this;
            socket.emit( "get_property_description", this.get( "name" ), property, function ( description ) {
                that.get( "properties" )[property] = description;
                /* trigger a model used to trigger a function of the view that is associated */
                that.trigger( "add:property", property );
            } );
        },

        /*
         *  Get description of all methods of the quiddity
         *  @param {function} callback Return the informations about methods
         */

        getMethodsDescription: function ( callback ) {
            var that = this;
            socket.emit( "get_methods_description", this.get( "name" ), function ( err, methodsDescription ) {
                if ( err ) {
                    views.global.notification( "error", err );
                }
                that.set( "methods", methodsDescription );
                callback( methodsDescription );
            } );
        },

        /*
         *  Set a mothod of the quiddity
         *  @param {string} method Name of the method
         *  @param {array} parameters Parameters of the method
         *  @param {function} callback Confirm the method is setted
         */

        setMethod: function ( method, parameters, callback ) {
            socket.emit( "invoke", this.get( "name" ), method, parameters, function ( ok ) {
                callback( ok );
            } );
        },

        /*
         *  Add a new method of quiddity
         *  This function is called by the server when a method is added
         *  @param {string} method Name of the method
         */

        addMethod: function ( method ) {
            var that = this;
            socket.emit( "get_method_description", this.get( "name" ), method, function ( err, description ) {
                if ( err ) {
                    return views.global.notification( 'error', err );
                }
                that.get( "methods" )[method] = description;
                /* Warned the view that the method has been added */
                that.trigger( "add:method", method );
            } );
        },


        /*
         *  Remove a method  of quiddity
         *  This function is called by the server when a method is removed
         */

        removeMethod: function ( method ) {
            delete this.get( "methods" )[method];
            /* Warned the view that the method has been removed */
            this.trigger( "remove:method", method );
        }


    } );

    return QuiddModel;
} );