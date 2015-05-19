"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/table/Source'
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
                table: this.options.table
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
            return this.options.table.filterQuiddityOrClass( 'source', quiddity, true );
        }
    } );

    return Sources;
} );
