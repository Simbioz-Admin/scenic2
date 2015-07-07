"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/DestinationView',
    'text!template/scenic/pages/sip/destination.html'
], function ( _, Backbone, Marionette, DestinationView, SIPDestinationTemplate ) {

    /**
     * SIP Destination View
     *
     * @constructor
     * @extends DestinationView
     */
    var SIPDestination = DestinationView.extend( {
        template: _.template( SIPDestinationTemplate ),

        attributes: function () {
            return {
                class: [ 'sip', 'destination', this.model.get('send_status') == 'calling' ? 'connected' : 'disconnected'].join(' ')
            }
        },

        ui: {
            call: '.actions .action.call',
            hangup: '.actions .action.hangup',
            remove: '.actions .action.remove'
        },

        events: {
            'click @ui.call': 'callDestination',
            'click @ui.hangup': 'hangDestination',
            'click @ui.remove': 'removeDestination'
        },

        modelEvents: {
            'change:send_status': 'render'
        },

        /**
         * Initialize
         */
        initialize: function( ) {
            DestinationView.prototype.initialize.apply(this, arguments);
        },

        /**
         * Attach handler
         */
        onRender: function() {
            // Update Dynamic Attributes
            this.$el.attr(this.attributes());
        },

        callDestination: function() {
            this.model.call();
        },

        hangDestination: function() {
            this.model.hangUp();
        },

        /**
         * Remove Handler
         *
         * @inheritdoc
         * @param event
         */
        removeDestination: function( event ) {
            var self = this;
            this.scenic.sessionChannel.commands.execute( 'confirm', i18n.t('Are you sure you want to remove the __destinationName__ destination?', {destinationName:this.model.get('name')}), function( confirmed ) {
                if ( confirmed ) {
                    self.model.disconnectAll();
                }
            });
        }
    } );

    return SIPDestination;
} );
