"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicCollection',
    'model/base/Destination'
], function ( _, Backbone, ScenicCollection, Destination ) {

    /**
     * Base Destination Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var Destinations = ScenicCollection.extend( {
        model:        Destination,

        /**
         * Initialize
         */
        initialize: function() {
            ScenicCollection.prototype.initialize.apply(this,arguments);
        }
    } );
    return Destinations;
} );
