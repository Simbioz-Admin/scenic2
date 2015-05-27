"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/inspector/edit/method.html'
], function ( _, Backbone, Marionette, MethodTemplate ) {

    /**
     * Method View
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var Method = Marionette.ItemView.extend( {
        template: _.template( MethodTemplate ),
        className: 'method',

        ui: {

        },

        events: {

        },

        modelEvents: {
            'change': 'renderOnChange'
        },

        /**
         * Initialize
         */
        initialize: function( ) {

        },

        renderOnChange: function() {
            this.render();
        }
    } );

    return Method;
} );
