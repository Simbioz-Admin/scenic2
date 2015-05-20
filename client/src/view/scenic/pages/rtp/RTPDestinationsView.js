"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/rtp/RTPDestinationView'
], function ( _, Backbone, Marionette, RTPDestinationView ) {

    /**
     * RTP Destination Collection
     *
     * @constructor
     * @augments module:Marionette.CollectionView
     */
    var RTPDestinations = Marionette.CollectionView.extend( {
        childView: RTPDestinationView,

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

    return RTPDestinations;
} );
