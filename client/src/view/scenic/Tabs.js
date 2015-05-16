"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/Tab',
    'text!template/scenic/tabs.html'
], function ( _, Backbone, Marionette, TabView, TabsTemplate ) {

    /**
     *  @constructor
     *  @augments module:Backbone.View
     */

    var TabsView = Marionette.CollectionView.extend( {
        childView: TabView,
        template: _.template(TabsTemplate),
        events:    {},
        initialize: function () {
        },
        onRender: function() {

        }
    } );

    return TabsView;
} );
