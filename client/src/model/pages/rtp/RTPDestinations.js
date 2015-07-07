"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/PropertyWatcherCollection',
    'model/pages/rtp/RTPDestination'
], function ( _, Backbone, PropertyWatcherCollection, RTPDestination ) {

    /**
     * RTP Destinations
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var RTPDestinations = PropertyWatcherCollection.extend( {
        model: RTPDestination,
        comparator: 'name',

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
            this.scenic = options.scenic;
            this.quiddityId = this.scenic.config.rtp.quiddName;
            this.propertyName = 'destinations-json';
            this.key = 'destinations';
            this.modelOptions = { scenic: this.scenic };
            PropertyWatcherCollection.prototype.initialize.apply(this,arguments);
        }
    } );

    return RTPDestinations;
} );
