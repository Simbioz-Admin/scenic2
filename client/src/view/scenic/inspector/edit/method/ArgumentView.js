"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/inspector/edit/method/argument.html'
], function ( _, Backbone, Marionette, ArgumentTemplate ) {

    /**
     * Argument View
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var Argument = Marionette.ItemView.extend( {
        template: _.template( ArgumentTemplate ),
        className: 'argument',

        ui: {
            input: '.input'
        },

        events: {
            'change @ui.input': 'updateArgument'
        },

        /**
         * Initialize
         */
        initialize: function( ) {

        },

        updateArgument: function() {
            this.model.set('value', this.ui.input.val() );
        }
    } );

    return Argument;
} );
