"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableView',
    'view/scenic/pages/base/table/SourcesView',
    'view/scenic/pages/base/table/DestinationsView',
    'view/scenic/pages/sink/SinkMenus',
], function ( _, Backbone, Marionette, TableView, SourcesView, DestinationsView, SinkMenus ) {

    /**
     * @constructor
     * @extends TableView
     */
    var Sink = TableView.extend( {

        className: 'table sink',

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
            this.showChildView( 'menus', new SinkMenus( {
                model: this.model
            } ) );
            this.showChildView( 'sources', new SourcesView( {
                table:      this.model,
                collection: this.model.getSourceCollection()
            } ) );
            this.showChildView( 'destinations', new DestinationsView( {
                table:      this.model,
                collection: this.model.getDestinationCollection()
            } ) );
        }
    } );

    return Sink;
} );
