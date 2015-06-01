"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/DestinationsView',
    'view/scenic/pages/control/ControlDestinationView'
], function ( _, Backbone, Marionette, DestinationsView, ControlDestinationView ) {

    /**
     * Control Destination Collection
     *
     * @constructor
     * @augments DestinationsView
     */
    var ControlDestinations = DestinationsView.extend( {
        childView: ControlDestinationView,

        /**
         * Initialize
         */
        initialize: function( ) {
            DestinationsView.prototype.initialize.apply( this, arguments );
        }
    } );

    return ControlDestinations;
} );
