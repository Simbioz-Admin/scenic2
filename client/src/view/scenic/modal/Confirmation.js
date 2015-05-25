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
            'dialog': '.dialog',
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
            this.ui.dialog.css('top', '-50px');
            this.ui.dialog.animate( { top: 0 }, 250, 'easeOutQuad' );
            this.ui.modal.animate( { opacity: 1 }, 100 );
        },

        close : function( callback, result ) {
            var self = this;
            this.ui.dialog.animate( { top: -50 }, 100, 'easeOutQuad' );
            this.ui.modal.animate( { opacity: 0 }, 100, function() {
                callback( result );
            } );
        },

        onYes: function() {
            this.close( this.callback, true );
        },

        onNo: function() {
            this.close( this.callback, false );
        }

    } );

    return ConfirmationView;
} );
