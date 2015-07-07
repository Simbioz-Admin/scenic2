"use strict";

define( [
    'underscore',
    'backbone',
    'async',
    'model/base/ScenicModel',
    'model/quiddity/Properties',
    'model/quiddity/Methods',
    'model/quiddity/Shmdatas'
], function ( _, Backbone, async, ScenicModel, Properties, Methods, Shmdatas ) {

    /**
     * Quiddity
     *
     * @constructor
     * @extends ScenicModel
     */

    var Quiddity = ScenicModel.extend( {

        defaults: function () {
            return {
                "id":         null,
                "class":      null,
                "tree":        {},
                // Dynamic
                "maxReaders": null
            }
        },

        mutators: {
            transient:        true,
            classDescription: function () {
                return this.scenic.classes.get( this.get( 'class' ) );
            }
        },

        parse: function( result ) {
            // TODO: Leave alone, and react on 'update' or something
            //result.properties = new Properties(result.properties, { parse: true, quiddity: this, scenic: this.scenic });
            //result.methods = new Methods(result.methods, { parse: true, quiddity: this, scenic: this.scenic });
            return result;
        },

        /**
         *  Initialize
         */
        initialize: function ( attributes, options ) {
            ScenicModel.prototype.initialize.apply( this, arguments );

            // Setup child collections

            this.properties                   = new Properties( this.get('properties'), {scenic: this.scenic, quiddity: this} );
            this.methods                      = new Methods( this.get('methods'), {scenic: this.scenic, quiddity: this} );
            this.shmdatas                     = new Shmdatas( this.get('tree' ) ? this.get('tree' ).shmdata : null, {scenic: this.scenic, quiddity: this, parse: true} );

            /*this.listenTo(this, 'sync', function( model, value, options ) {
                this.properties.set( value, {scenic:this.scenic} );
                console.log(this.properties);
            });*/

            /*this.listenTo(this, 'change:methods', function( model, value, options ) {
                this.methods.set( value, {scenic:this.scenic} );
            });*/

            // Only fetch the rest when we are not new
            // This prevents fetches and socket binding being done by temporary quiddities
            if ( !this.isNew() ) {
                this.properties.bindToSocket();
                //this.properties.fetch();
                this.methods.bindToSocket();
                //this.methods.fetch();
                this.shmdatas.bindToSocket();
                //this.shmdatas.fetch();

                // Handlers
                this.onSocket( 'quiddity.removed', _.bind( this._onRemoved, this ) );
                this.onSocket( 'quiddity.tree.updated', _.bind( this._onTreeUpdated, this ) );
            }

        },

        /**
         * Delete Handler
         * Destroy this quiddity and its child collections if our id matches the one being removed
         *
         * @param {String} quiddityId
         * @private
         */
        _onRemoved: function ( quiddityId ) {
            if ( this.id == quiddityId ) {
                // Broadcast first so that everyone has a change to identify
                this.scenic.sessionChannel.vent.trigger( 'quiddity:removed', this );

                // Destroy child collections
                this.properties.destroy();
                this.methods.destroy();
                this.shmdatas.destroy();

                // Destroy ourselves
                this.trigger( 'destroy', this, this.collection );
            }
        },

        /**
         * Tre Updated Handler
         *
         * @param {string} quiddityId
         * @param {Object} tree
         * @private
         */
        _onTreeUpdated: function( quiddityId, tree ) {
            if ( this.id == quiddityId ) {
                this.set('tree', tree);
            }
        },

        /**
         *  Edit Quiddity
         */
        edit: function () {
            this.scenic.sessionChannel.commands.execute( 'quiddity:edit', this );
        }

    } );

    return Quiddity;
} );