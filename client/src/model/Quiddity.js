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
     * Quiddity
     *
     * @constructor
     * @extends ScenicModel
     */

    var QuiddModel = ScenicModel.extend( {

        idAttribute: 'name',

        defaults: function () {
            return {
                "name":             null,
                "newName":          null, // Name is the is we need to separate the requested name
                "class":            null,
                "category":         null,
                "long name":        null,
                "description":      null,
                "encoder_category": null,
                "view":             null,
                "properties":       new Properties(),
                "methods":          new Methods(),
                "shmdatas":         new Shmdatas()
            }
        },

        /**
         *  Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply( this, arguments );

            // Main communication channel
            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            // Setup child collections
            this.get( 'properties' ).quiddity = this;
            this.get( 'methods' ).quiddity    = this;
            this.get( 'shmdatas' ).quiddity   = this;
            if ( !this.isNew() ) {
                this.get( 'properties' ).fetch();
                this.get( 'methods' ).fetch();
                this.get( 'shmdatas' ).fetch();
            }

            // Handlers
            this.onSocket( "remove", _.bind( this._onRemoved, this ) );
        },

        /**
         * Delete Handler
         *
         * @param {String} quiddityId
         * @private
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
         * @param key
         * @param value
         */
        setProperty: function ( key, value ) {
            var property = this.get( 'properties' ).get( key );
            if ( !property ) {
                console.debug( 'Quiddity:setProperty', key, value );
                property = this.get( 'properties' ).add( {name: key, value: value} );
            }
            property.set( 'value', value );
        },

        /**
         *  Edit Quiddity
         *  Put the quiddity in edit mode by updating its properties and descriptions,
         *  then subscribing to get real-time updates
         */
        edit: function () {
            var self = this;
            //TODO: Get properties
            //TODO: Get methods
            //TODO: Subscribe socket.emit( "subscribe_info_quidd", self.id, socket.id );
            this.scenicChannel.commands.execute( 'quiddity:edit', self );
        },

        //  ██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗
        //  ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝
        //  ██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝
        //  ██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝
        //  ███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║
        //  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝
        //


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