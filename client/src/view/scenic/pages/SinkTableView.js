"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableView',
    'view/scenic/pages/base/table/SourcesView',
    'view/scenic/pages/base/table/DestinationsView',
    'view/scenic/pages/sink/SinkConnectionView',
    'view/scenic/pages/sink/SinkMenus'
], function ( _, Backbone, Marionette, TableView, SourcesView, DestinationsView, SinkConnectionView, SinkMenus ) {

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
                scenic: this.scenic,
                model: this.model
            } ) );
            this.showChildView( 'sources', new SourcesView( {
                scenic: this.scenic,
                table:      this.model,
                collection: this.model.getSourceCollection(),
                connectionView: SinkConnectionView
            } ) );
            this.showChildView( 'destinations', new DestinationsView( {
                scenic: this.scenic,
                table:      this.model,
                collection: this.model.getDestinationCollection()
            } ) );
        }
    } );

    return Sink;
} );
