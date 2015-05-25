"use strict";

define( [
    'underscore',
    'backbone',
    'model/pages/rtp/RTPDestination'
], function ( _, Backbone, RTPDestination ) {

    /**
     * RTP Destinations
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var RTPDestinations = Backbone.Collection.extend( {
        model: RTPDestination,

        /**
         * Initialization
         * A property option is passed to the collection, this is the property that will be wrapped in this collection.
         * In that case it is the "destinations-json" property of the rtp quiddity, so that we can expose it as its
         * own collection to render/filter in the ui for example.
         *
         * @param models
         * @param options
         */
        initialize: function ( models, options ) {
            this.wrappedProperty = options.property;

            // By listening to "change" and using "set" we are merely wrapping the property as a collection
            this.listenTo( this.wrappedProperty, 'change', this.updateCollection, this );

            // Call it to initialize
            this.updateCollection();
        },

        /**
         * Update the wrapper collection from the property value
         */
        updateCollection: function () {
            this.set( this.wrappedProperty.get( 'value' ).destinations );
        }
    } );

    return RTPDestinations;
} );
