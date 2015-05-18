"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/table/Menu',
    'view/scenic/table/Sources',
    'view/scenic/table/Destinations',
    'text!template/scenic/table.html'
], function ( _, Backbone, Marionette, MenuView, SourcesView, DestinationsView, TableTemplate ) {

    /**
     *  @constructor
     *  @augments module:Marionette.LayoutView
     */
    var Table = Marionette.LayoutView.extend( {
        tagName: 'div',
        className: 'table',
        template: _.template(TableTemplate),
        regions: {
            'menu': '.menu',
            'destinations': '.destinations',
            'sources': '.sources'
        },

        /**
         * Initialize
         */
        initialize: function( ) {

        },

        /**
         * Before Show Handler
         *
         * @private
         */
        onBeforeShow: function( ) {
            this.showChildView('menu', new MenuView({ model: this.model }));
            this.showChildView('sources', new SourcesView({ table: this.model, collection: app.quiddities }));
            this.showChildView('destinations', new DestinationsView({ table: this.model, collection: app.quiddities }));
        }
    } );

    return Table;
} );
