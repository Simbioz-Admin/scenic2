"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableView',
    'view/scenic/pages/base/table/SourcesView',
    'view/scenic/pages/rtp/RTPConnectionView',
    'view/scenic/pages/rtp/RTPDestinationsView',
    'view/scenic/pages/rtp/RTPMenus'
], function ( _, Backbone, Marionette, TableView, SourcesView, RTPConnectionView, RTPDestinationsView, RTPMenus ) {

    /**
     *  @constructor
     *  @augments TableView
     */
    var RTPTableView = TableView.extend( {

        className: 'table rtp',

        /**
         * Initialize
         */
        initialize: function () {
            TableView.prototype.initialize.apply( this, arguments );
        },

        /**
         * Before Show Handler
         *
         * @private
         */
        onBeforeShow: function () {
            this.showChildView( 'menus', new RTPMenus( {
                scenic: this.scenic,
                model:  this.model
            } ) );
            this.showChildView( 'sources', new SourcesView( {
                scenic: this.scenic,
                table:          this.model,
                collection:     this.model.getSourceCollection(),
                connectionView: RTPConnectionView
            } ) );
            this.showChildView( 'destinations', new RTPDestinationsView( {
                scenic: this.scenic,
                table:      this.model,
                collection: this.model.getDestinationCollection()
            } ) );
        }
    } );

    return RTPTableView;
} );
