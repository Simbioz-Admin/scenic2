"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/Destinations',
    'model/SIPDestination'
], function ( _, Backbone, Destinations, SIPDestination ) {

    /**
     * SIP Destination Collection
     *
     * @constructor
     * @extends Destinations
     */
    var SIPDestinations = Destinations.extend( {
        model:        SIPDestination,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   null
        },

        /**
         * Initialize
         */
        initialize: function() {
            Destinations.prototype.initialize.apply(this,arguments);
        }
    } );

    return SIPDestinations;
} );
