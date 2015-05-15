"use strict";

define( [
    'underscore',
    'backbone',
    'model/Destination'
], function ( _, Backbone, Destination ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Collection
     */
    var Destinations = Backbone.Collection.extend( {
        model:        Destination,
    } );
    return Destinations;
} );
