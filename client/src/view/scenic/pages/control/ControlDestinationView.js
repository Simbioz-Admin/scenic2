"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/DestinationView',
    'text!template/scenic/pages/control/destination.html'
], function ( _, Backbone, Marionette, DestinationView, ControlDestinationTemplate ) {

    /**
     * Control Destination View
     *
     * @constructor
     * @extends DestinationView
     */
    var ControlDestination = DestinationView.extend( {
        template: _.template( ControlDestinationTemplate ),
        className: 'control destination',

        /**
         * Initialize
         */
        initialize: function( ) {
            DestinationView.prototype.initialize.apply(this, arguments);
        }
    } );

    return ControlDestination;
} );
