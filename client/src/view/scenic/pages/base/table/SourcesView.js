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
    var Sources = Marionette.CollectionView.extend( {
        className:        'source-list',
        getChildView:     function ( item ) {
            if ( item.get( 'class' ) == 'sip' ) {
                return SIPSourceView;
            }
            else {
                return SourceView;
            }
        },
        childViewOptions: function () {
            return {
                table:          this.options.table,
                connectionView: this.options.connectionView
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
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

    return Sources;
} );
