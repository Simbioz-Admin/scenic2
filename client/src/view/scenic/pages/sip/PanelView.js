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

            //TODO: Not the best way, will re-render on every contact change
            this.listenTo( this.model.sip.get( 'contacts' ), 'update', this._checkSelf );
        },

        onBeforeShow: function () {
            this.showChildView( 'self', new SelfView( {model: this.model.sip.get( 'self' )} ) );
            this.showChildView( 'control', new ControlView( {model: this.model.sip} ) );
            this.showChildView( 'contacts', new ContactsView( {
                table:      this.model,
                collection: this.model.sip.get( 'contacts' )
            } ) );
        }
    } );

    return PanelView;
} );
