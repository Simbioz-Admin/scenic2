"use strict";

define( [
    'underscore',
    'backbone',
    'model/pages/control/ControlDestination'
], function ( _, Backbone, ControlDestination ) {

    /**
     * Control Destinations
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var ControlDestinations = Backbone.Collection.extend( {
        model: ControlDestination,

        /**
         * Initialization
         * A quiddities option is passed to the collection, this is the collection that will be wrapped in this collection.
         *
         * @param models
         * @param options
         */
        initialize: function ( models, options ) {
            this.wrappedCollection = options.quiddities;

            // By listening to "wrappedCollection" and using "set" we are merely wrapping/filtering the collection
            this.listenTo( this.wrappedCollection, 'update', this.updateCollection, this );

            // Call it to initialize
            this.updateCollection();
        },

        /**
         * Update the wrapper collection from the property value
         */
        updateCollection: function () {
            //this.set( this.wrappedCollection.get( 'value' ).destinations );
        }
    } );

    return ControlDestinations;
} );
