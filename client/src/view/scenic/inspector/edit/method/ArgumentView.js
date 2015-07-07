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
            'change @ui.input': 'updateArgument',
            'keypress @ui.input': 'checkForEnterKey'
        },

        modelEvents: {
            'change:value': 'render'
        },

        /**
         * Initialize
         */
        initialize: function( ) {

        },

        updateArgument: function() {
            this.model.set('value', this.ui.input.val() );
        },

        checkForEnterKey: function() {
            var key = event.which || event.keyCode;
            if ( key == 13 ) {
                event.preventDefault();
                this.updateArgument();
                this.model.collection.method.invoke();
            }
        }
    } );

    return Argument;
} );
