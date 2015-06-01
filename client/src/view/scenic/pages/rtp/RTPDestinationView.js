"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/DestinationView',
    'text!template/scenic/pages/rtp/destination.html'
], function ( _, Backbone, Marionette, DestinationView, RTPDestinationTemplate ) {

    /**
     * RTP Destination View
     *
     * @constructor
     * @extends DestinationView
     */
    var RTPDestination = DestinationView.extend( {
        template: _.template( RTPDestinationTemplate ),
        className: 'rtp destination',

        /**
         * Initialize
         */
        initialize: function( ) {
            DestinationView.prototype.initialize.apply(this, arguments);
        }
    } );

    return RTPDestination;
} );
