"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableView',
    'view/scenic/pages/base/table/SourcesView',
    'view/scenic/pages/control/ControlDestinationsView',
    'view/scenic/pages/control/ControlMenusView',
    'view/scenic/pages/control/ControlSourceView',
    'view/scenic/pages/control/ControlConnectionView'
], function ( _, Backbone, Marionette, TableView, SourcesView, ControlDestinationsView, ControlMenus, ControlSourceView, ControlConnectionView ) {

    /**
     *  @constructor
     *  @augments TableView
     */
    var ControlTableView = TableView.extend( {

        className: 'table control',

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
            this.showChildView( 'menus', new ControlMenus( {
                model: this.model
            } ) );
            this.showChildView( 'sources', new SourcesView( {
                table:      this.model,
                collection: this.model.getSourceCollection(),
                sourceView: ControlSourceView,
                connectionView: ControlConnectionView
            } ) );
            this.showChildView( 'destinations', new ControlDestinationsView( {
                table:      this.model,
                collection: this.model.getDestinationCollection()
            } ) );
        }
    } );

    return ControlTableView;
} );
