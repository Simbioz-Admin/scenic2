"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/tab.html'
], function ( _, Backbone, Marionette, TabTemplate ) {

    /**
     *  @constructor
     *  @augments module:Backbone.View
     */

    var TabView = Marionette.ItemView.extend( {
        tagName: 'div',
        template: _.template(TabTemplate),
        events:    {
            'click': 'activate'
        },
        attributes: function () {
            return {
                class: [ 'tab', this.model.get('type'), this.model.get("name" ).toLowerCase(), this.model.get('active') ? 'active' : 'inactive'].join(' '),
                title: this.model.get('description')
            }
        },
        modelEvents: {
            "change:active": "render"
        },
        initialize: function () {

        },
        onRender: function() {
            this.$el.attr(this.attributes());
        },
        activate: function() {
            this.model.activate();
        }
    } );

    return TabView;
} );
