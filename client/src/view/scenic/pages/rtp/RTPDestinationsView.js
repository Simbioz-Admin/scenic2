"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/DestinationsView',
    'view/scenic/pages/rtp/RTPDestinationView'
], function ( _, Backbone, Marionette, DestinationsView, RTPDestinationView ) {

    /**
     * RTP Destination Collection
     *
     * @constructor
     * @augments DestinationsView
     */
    var RTPDestinations = DestinationsView.extend( {
        childView: RTPDestinationView,

        /**
         * Initialize
         */
        initialize: function( ) {
            DestinationsView.prototype.initialize.apply( this, arguments );
        }
    } );

    return RTPDestinations;
} );
