"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/sip/SelfView',
    'view/scenic/pages/sip/ControlView',
    'view/scenic/pages/sip/ContactsView',
    'text!template/scenic/pages/sip/panel.html'
], function ( _, Backbone, Marionette, SelfView, ControlView, ContactsView, PanelTemplate ) {

    /**
     * SIP Panel View
     *
     * @constructor
     * @extends module:Marionette.LayoutView
     */
    var PanelView = Marionette.LayoutView.extend( {
        template: _.template( PanelTemplate ),

        regions: {
            self:     '.self',
            control:  '.control',
            contacts: '.contacts'
        },

        /**
         * Initialize
         */
        initialize: function ( options ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.listenTo(this.model.sip.get('contacts'), 'update', this.showSelf);
        },

        onBeforeShow: function () {
            this.showChildView( 'control', new ControlView( {model: this.model.sip} ) );
            this.showChildView( 'contacts', new ContactsView( {
                table:      this.model,
                collection: this.model.sip.get( 'contacts' )
            } ) );
            this.showSelf();
        },

        showSelf: function() {
            var self = this.model.sip.get('contacts' ).findWhere({self:true});
            if ( self ) {
                this.showChildView( 'self', new SelfView( { model: self } ) );
            } else {
                this.getRegion( 'self' ).empty();
            }
        }
    } );

    return PanelView;
} );
