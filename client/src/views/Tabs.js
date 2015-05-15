"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'views/Tab',
    'text!../../templates/tabs.html'
], function ( _, Backbone, Marionette, TabView, TabsTemplate ) {

    /**
     *  @constructor
     *  @augments module:Backbone.View
     */

    var TabsView = Marionette.CollectionView.extend( {
        el: '#tabs',
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
