"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/modal/confirmation.html'
], function ( _, Backbone, Marionette, ConfirmationTemplate ) {

    /**
     *  @constructor
     *  @augments module:Marionette.ItemView
     */
    var ConfirmationView = Marionette.ItemView.extend( {
        template: _.template( ConfirmationTemplate ),

        ui : {
            'modal': '.modal',
            'yes': '.yes',
            'no': '.no'
        },

        events: {
            'click @ui.yes': 'onYes',
            'click @ui.no': 'onNo'
        },

        initialize: function ( options ) {
            this.message = options.message;
            this.callback = options.callback;
        },

        serializeData: function(){
            return {
                message: this.message
            };
        },

        onShow: function() {
            this.ui.modal.animate( { opacity: 1 }, 100 );
        },

        onYes: function() {
            this.callback( true );
        },

        onNo: function() {
            this.callback( false );
        }

    } );

    return ConfirmationView;
} );
