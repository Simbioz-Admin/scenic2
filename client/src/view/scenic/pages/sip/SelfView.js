"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/pages/sip/self.html',
    'text!template/scenic/pages/sip/status.html'
], function ( _, Backbone, Marionette, SelfTemplate, StatusTemplate ) {

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
            'alias': '#alias',
            'selfStatus': '.contact-status',
            'status': '.status',
            'statusText': '.contact-status-text'
        },

        events: {
            'keypress @ui.alias': 'checkForEnterKey',
            'blur @ui.alias': 'update',
            'keypress @ui.statusText': 'checkForEnterKey',
            'blur @ui.statusText': 'update',
            'click @ui.selfStatus': 'showStatusList',
            'click @ui.status': 'changeStatus'
        },

        modelEvents: {
            'change': 'render'
        },

        templateHelpers: function() {
            return {
                statuses: this.model.sip.quiddity.properties.get('status' ).get('options')
            }
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
            this.model.save({name: this.ui.alias.val(), status_text: this.ui.statusText.val()}, {
                error: function ( error ) {
                    self.scenicChannel.vent.trigger('error', error);
                }
            });
        },

        showStatusList: function( event ) {
            event.stopImmediatePropagation();
            this.$el.append( _.template( StatusTemplate )( { statuses: this.model.sip.quiddity.properties.get('status' ).get('options') } ) );
            $('body' ).on('click', _.bind( this.closeStatusList, this ) );
        },

        changeStatus: function( event ) {
            var self = this;
            var status = $( event.currentTarget ).data('status');
            this.model.save({status: status}, {
                error: function ( error ) {
                    self.scenicChannel.vent.trigger('error', error);
                }
            });
            this.closeStatusList();
        },

        closeStatusList: function() {
            console.log('casdad');
            $('body' ).off('click', _.bind( this.closeStatusList, this ) );
            $('.status-list', this.$el ).remove();
        }

    } );

    return SelfView;
} )
;
