"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/DestinationView'
], function ( _, Backbone, Marionette, DestinationView ) {

    /**
     * Destination Collection
     *
     * @constructor
     * @augments module:Marionette.CollectionView
     */
    var Destinations = Marionette.CollectionView.extend( {
        childView: DestinationView,
        className: 'destination-list',

        /**
         * Initialize
         */
        initialize: function( ) {
            this.listenTo( this.options.table, 'change:filter', this.render );
        },

        /**
         * Destinations View Filter
         *
         * @param quiddity
         * @returns {boolean}
         */
        filter: function (quiddity) {
            return this.options.table.filterDestination( quiddity, true );
        }
    } );

    return Destinations;
} );
