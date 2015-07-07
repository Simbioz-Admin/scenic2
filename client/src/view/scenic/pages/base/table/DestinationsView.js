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
        childView:        DestinationView,
        childViewOptions: function () {
            return {
                scenic: this.scenic,
                table: this.table
            }
        },
        className:        'destination-list',

        /**
         * Initialize
         */
        initialize: function ( options ) {
            this.scenic = options.scenic;
            this.table = options.table;
            this.listenTo( this.table, 'change:filter', this.render );
        },

        /**
         * Destinations View Filter
         *
         * @param destination
         * @returns {boolean}
         */
        filter: function ( destination ) {
            return this.table.filterDestination( destination, true );
        }
    } );

    return Destinations;
} );
