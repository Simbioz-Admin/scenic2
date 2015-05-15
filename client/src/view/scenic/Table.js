"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/table/Menu',
    'view/scenic/table/Sources',
    'view/scenic/table/Destinations',
    'text!../../../template/table.html'
], function ( _, Backbone, Marionette, MenuView, SourcesView, DestinationsView, TableTemplate ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Marionette.LayoutView
     */
    var Table = Backbone.Marionette.LayoutView.extend( {
        tagName: 'div',
        className: 'table',
        template: _.template(TableTemplate),
        regions: {
            'menu': '.menu',
            'destinations': '.destinations',
            'sources': '.sources'
        },
        /*childEvents: {
            'create:quiddity': function(){console.log('dans la table');}
        },*/

        initialize: function( ) {
        },

        onBeforeShow: function( ) {
            this.showChildView('menu', new MenuView({ model: this.model }));
            this.showChildView('sources', new SourcesView());
            this.showChildView('destinations', new DestinationsView());
        }
    } );
    return Table;
} );
