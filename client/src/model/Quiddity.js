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

    var Quiddity = ScenicModel.extend( {


        defaults: function () {
            return {
                "id":          null,
                "class":       null,
                "properties":  new Properties(),
                "methods":     new Methods(),
                "shmdatas":    new Shmdatas(),
                // Dynamic
                "maxReaders":  null
            }
        },

        mutators: {
            transient: true,
            classDescription: function() {
                return this.collection.classes.get( this.get('class') );
            }
        },

        /**
         *  Initialize
         */
        initialize: function ( attributes, options ) {
            ScenicModel.prototype.initialize.apply( this, arguments );

            // Setup child collections
            this.get( 'properties' ).quiddity = this;
            this.get( 'methods' ).quiddity    = this;
            this.get( 'shmdatas' ).quiddity   = this;

            // Only fetch the rest when we are not new
            // This prevents fetches and socket binding being done by temporary quiddities
            if ( !this.isNew() ) {
                this.get( 'properties' ).bindToSocket();
                this.get( 'properties' ).fetch();
                this.get( 'methods' ).bindToSocket();
                this.get( 'methods' ).fetch();
                this.get( 'shmdatas' ).bindToSocket();
                this.get( 'shmdatas' ).fetch();

                // Handlers
                this.onSocket( "remove", _.bind( this._onRemoved, this ) );
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
                this.scenicChannel.vent.trigger( 'quiddity:removed', this );

                // Destroy child collections
                this.get( 'properties' ).destroy();
                this.get( 'methods' ).destroy();
                this.get( 'shmdatas' ).destroy();

                // Destroy ourselves
                this.trigger( 'destroy', this, this.collection );
            }
        },

        /**
         *  Edit Quiddity
         */
        edit: function () {
            this.scenicChannel.commands.execute( 'quiddity:edit', this );
        }

    } );

    return Quiddity;
} );