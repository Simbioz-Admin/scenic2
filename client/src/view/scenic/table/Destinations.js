"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/table/Destination'
], function ( _, Backbone, Marionette, DestinationView ) {

    /**
     * Destination Collection
     *
     * @constructor
     * @augments module:Marionette.CollectionView
     */
    var Destinations = Marionette.CollectionView.extend( {
        childView: DestinationView,

        /**
         * Initialize
         */
        initialize: function( ) {

        },

        /**
         * Destinations View Filter
         *
         * @param quiddity
         * @returns {boolean}
         */
        filter: function (quiddity) {
            return this.model.filterQuiddityOrClass( 'destination', quiddity );
        }
    } );

    return Destinations;
} );
