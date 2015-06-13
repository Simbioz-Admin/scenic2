"use strict";

define( [
    'underscore',
    'backbone',
    'cocktail',
    'model/mixins/PropertyWatcher'
], function ( _, Backbone, Cocktail, PropertyWatcher ) {

    /**
     * Property watcher collection
     * Watches the value of a property on a quiddity
     * Will track when the quiddity and/or property is added/removed
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var PropertyWatcherCollection = Backbone.Collection.extend( {

        modelOptions: {},

        /**
         * Initialization
         *
         * @param models
         * @param options
         */
        initialize: function ( models, options ) {

        },

        /**
         * Update Destinations
         * Verifies that we have a rtp quiddity which possesses a destinations-json property
         */
        propertyChanged: function ( value ) {
            if ( value ) {
                this.set( value, this.modelOptions );
            } else {
                this.reset();
            }
        }
    } );

    Cocktail.mixin( PropertyWatcherCollection, PropertyWatcher );

    return PropertyWatcherCollection;
} );
