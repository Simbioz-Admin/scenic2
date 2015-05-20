"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/Destinations',
    'model/RTPDestination'
], function ( _, Backbone, Destinations, RTPDestination ) {

    /**
     * RTP Destination Collection
     *
     * @constructor
     * @extends Destinations
     */
    var RTPDestinations = Destinations.extend( {
        model:        RTPDestination,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'listRTPDestinations'
        },

        /**
         * Initialize
         */
        initialize: function() {
            Destinations.prototype.initialize.apply(this,arguments);
        }
    } );

    return RTPDestinations;
} );
