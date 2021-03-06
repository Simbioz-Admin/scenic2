"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/SourceView',
    'view/scenic/pages/sip/SIPSourceView'
], function ( _, Backbone, Marionette, SourceView, SIPSourceView ) {

    /**
     * Source Collection
     *
     * @constructor
     * @augments module:Marionette.CollectionView
     */
    var SourcesView = Marionette.CollectionView.extend( {
        className:        'source-list',
        getChildView:     function ( item ) {
            // This is per-quiddity and not per-table that's why
            // it was not passed as an option
            if ( item.get( 'class' ) == 'sip' ) {
                return SIPSourceView;
            } else {
                return this.options.sourceView ? this.options.sourceView : SourceView;
            }
        },
        childViewOptions: function () {
            return {
                scenic:          this.scenic,
                table:           this.options.table,
                sourceChildView: this.options.sourceChildView,
                connectionView:  this.options.connectionView
            }
        },

        /**
         * Initialize
         */
        initialize: function (options) {
            this.scenic = options.scenic;
            this.listenTo( this.options.table, 'change:filter', this.render );
        },

        /**
         * Sources View Filter
         * Filters quiddities for the current table view table view
         *
         * @param quiddity
         * @returns {boolean}
         */
        filter: function ( quiddity ) {
            return this.options.table.filterSource( quiddity, true );
        }
    } );

    return SourcesView;
} );
