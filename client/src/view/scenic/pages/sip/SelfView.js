"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/pages/sip/self.html'
], function ( _, Backbone, Marionette, SelfTemplate ) {

    /**
     * SIP Self View
     *
     * @constructor
     * @extends module:Marionette.ItemVIew
     */
    var SelfView = Marionette.ItemView.extend( {
        template: _.template( SelfTemplate ),
        className: 'contact self',

        ui: {
            'alias': '#alias'
        },

        events: {
            'keypress @ui.alias': 'checkForEnterKey',
            'blur @ui.alias': 'update'
        },

        modelEvents: {
            'change': 'render'
        },

        attributes: function () {
            return {
                class: ['contact', this.model.get( 'status' ).toLowerCase(), this.model.get( 'subscription_state' ).toLowerCase()].join( ' ' )
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
        },

        onRender: function () {
            // Update Dynamic Attributes
            this.$el.attr( this.attributes() );
        },

        checkForEnterKey: function( event ) {
            var key = event.which || event.keyCode;
            if ( key == 13 ) {
                event.preventDefault();
                this.update();
            }
        },

        update: function() {
            var self = this;
            this.model.save({name: this.ui.alias.val()}, {
                error: function ( error ) {
                    self.scenicChannel.vent.trigger('error', error);
                }
            });
        }
    } );

    return SelfView;
} )
;
