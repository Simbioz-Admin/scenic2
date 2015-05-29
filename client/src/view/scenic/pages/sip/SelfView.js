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

        },

        events: {

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
        }
    } );

    return SelfView;
} )
;
