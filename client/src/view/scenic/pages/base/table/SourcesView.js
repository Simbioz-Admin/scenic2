"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/SourceView'
], function ( _, Backbone, Marionette, SourceView ) {

    /**
     * Source Collection
     *
     * @constructor
     * @augments module:Marionette.CollectionView
     */
    var Sources = Marionette.CollectionView.extend( {
        childView: SourceView,
        childViewOptions: function() {
            return {
                table: this.options.table,
                connectionView: this.options.connectionView
            }
        },

        /**
         * Initialize
         */
        initialize: function(  ) {
            this.listenTo( this.options.table, 'change:filter', this.render );
        },

        /**
         * Sources View Filter
         * Filters quiddities for the current table view table view
         *
         * @param quiddity
         * @returns {boolean}
         */
        filter: function (quiddity) {
            return this.options.table.filterSource( quiddity, true );
        }
    } );

    return Sources;
} );
