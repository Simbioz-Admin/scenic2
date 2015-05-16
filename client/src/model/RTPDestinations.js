"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/Destinations',
    'model/RTPDestination'
], function ( _, Backbone, Destinations, RTPDestination ) {

    /**
     *  @constructor
     *  @extends Destinations
     */
    var RTPDestinations = Destinations.extend( {
        model:        RTPDestination,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'listRtpDestinations'
        },
        initialize: function() {
            Destinations.prototype.initialize.apply(this,arguments);
        }
    } );
    return RTPDestinations;
} );
