"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/tab.html'
], function ( _, Backbone, Marionette, TabTemplate ) {

    /**
     * Tab
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */

    var TabView = Marionette.ItemView.extend( {

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

        /**
         * Initialize
         */
        initialize: function () {

        },

        /**
         * Attach handler
         */
        onRender: function() {
            // Update Dynamic Attributes
            this.$el.attr(this.attributes());
        },

        /**
         * Activate Handler
         * Activates the model assigned to this tab
         */
        activate: function() {
            this.model.activate();
        }
    } );

    return TabView;
} );
