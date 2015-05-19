"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/Destinations',
    'model/ControlDestination'
], function ( _, Backbone, Destinations, ControlDestination ) {

    /**
     * Control Destination Collection
     *
     * @constructor
     * @extends Destinations
     */
    var ControlDestinations = Destinations.extend( {
        model:        ControlDestination,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'listControlDestinations'
        },

        /**
         * Initialize
         */
        initialize: function() {
            Destinations.prototype.initialize.apply(this,arguments);
        }
    } );

    return ControlDestinations;
} );