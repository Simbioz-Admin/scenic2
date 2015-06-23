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
                table: this.table
            }
        },
        className:        'destination-list',

        /**
         * Initialize
         */
        initialize: function ( options ) {
            this.table = options.table;
            this.listenTo( this.table, 'change:filter', this.render );
        },

        /**
         * Destinations View Filter
         *
         * @param quiddity
         * @returns {boolean}
         */
        filter: function ( quiddity ) {
            return this.table.filterDestination( quiddity, true );
        }
    } );

    return Destinations;
} );
