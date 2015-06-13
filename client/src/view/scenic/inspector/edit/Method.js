"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/inspector/edit/method/ArgumentView',
    'text!template/scenic/inspector/edit/method.html'
], function ( _, Backbone, Marionette, ArgumentView, MethodTemplate ) {

    /**
     * Method View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var Method = Marionette.CompositeView.extend( {
        template: _.template( MethodTemplate ),
        tagName: 'li',
        className: 'method',

        childView: ArgumentView,
        childViewContainer: '.arguments-container',

        ui: {
            invoke: '.invoke'
        },

        events: {
            'click @ui.invoke': 'invoke'
        },

        modelEvents: {
            'change': 'renderOnChange'
        },

        /**
         * Initialize
         */
        initialize: function( ) {
            this.collection = this.model.args;
        },

        renderOnChange: function() {
            this.render();
        },

        invoke: function() {
            this.model.invoke();
        }
    } );

    return Method;
} );
