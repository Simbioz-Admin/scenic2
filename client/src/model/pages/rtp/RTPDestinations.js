"use strict";

define( [
    'underscore',
    'backbone',
    'model/pages/rtp/RTPDestination'
], function ( _, Backbone, Property, RTPDestination ) {

    /**
     * RTP Destinations
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var RTPDestinations = Backbone.Collection.extend( {
        model: RTPDestination
    } );

    return RTPDestinations;
} );
