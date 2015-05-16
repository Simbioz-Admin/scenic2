"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/table/destination.html'
], function ( _, Backbone, Marionette, DestinationTemplate ) {

    /**
     * Destination View
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var Destination = Marionette.ItemView.extend( {
        template: _.template( DestinationTemplate ),
        className: 'quiddity destination',

        /**
         * Initialize
         */
        initialize: function( ) {

        }
    } );

    return Destination;
} );
