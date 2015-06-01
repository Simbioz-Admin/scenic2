"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/DestinationsView',
    'view/scenic/pages/sip/SIPDestinationView'
], function ( _, Backbone, Marionette, DestinationsView, SIPDestinationView ) {

    /**
     * SIP Destination Collection
     *
     * @constructor
     * @augments DestinationsView
     */
    var SIPDestinations = DestinationsView.extend( {
        childView: SIPDestinationView,

        /**
         * Initialize
         */
        initialize: function( ) {
            DestinationsView.prototype.initialize.apply( this, arguments );
        }
    } );

    return SIPDestinations;
} );
