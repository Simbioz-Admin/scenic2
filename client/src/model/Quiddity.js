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

            this.get( 'properties' ).quiddity = this;
            this.get( 'methods' ).quiddity = this;
            this.get( 'shmdatas' ).quiddity = this;
            if ( !this.isNew() ) {
                this.get( 'properties' ).fetch();
                this.get( 'methods' ).fetch();
                this.get( 'shmdatas' ).fetch();
            }

            // Handlers
            socket.on( "remove", _.bind( this._onRemoved, this ) );
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
         * Set Property Helper
         * Will add the property if it doesn't exists
         *
         * @param property
         * @param value
         */
        setProperty: function( property, value ) {
            var property = this.get('properties').get(property);
            if ( !property ) {
                property = this.get('properties' ).add({name:property,value:value});
            }
            property.set('value', value);
        },

        //  ██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗
        //  ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝
        //  ██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝
        //  ██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝
        //  ███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║
        //  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝
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
        }

    } );

    return QuiddModel;
} );