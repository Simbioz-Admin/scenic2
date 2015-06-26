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
            this.listenTo(this.model.sip, 'change:self', this.onSelfChanged);
        },

        onBeforeShow: function () {
            this.showChildView( 'control', new ControlView( {model: this.model.sip} ) );
            this.showChildView( 'contacts', new ContactsView( {
                table:      this.model,
                collection: this.model.sip.get( 'contacts' )
            } ) );
        },

        onSelfChanged: function() {
            if ( this.model.sip.get( 'self' ) ) {
                this.showChildView( 'self', new SelfView( { model: this.model.sip.get( 'self' ) } ) );
            } else {
                this.getRegion( 'self' ).empty();
            }
        }
    } );

    return PanelView;
} );
