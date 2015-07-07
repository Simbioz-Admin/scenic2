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

        ui: {
            logout: '.action.logout',
            addContact: '.action.add'
        },

        regions: {
            self:     '.self',
            contacts: '.contacts'
        },

        events: {
            'click @ui.logout': 'logout',
            'click @ui.addContact': 'addContact'
        },

        /**
         * Initialize
         */
        initialize: function ( options ) {
            this.listenTo(this.model.sip.contacts, 'update', this.showSelf);
        },

        onBeforeShow: function () {
            this.showChildView( 'contacts', new ContactsView( {
                table:      this.model,
                collection: this.model.sip.contacts
            } ) );
            this.showSelf();
        },

        showSelf: function() {
            var self = this.model.sip.contacts.findWhere({self:true});
            if ( self ) {
                this.showChildView( 'self', new SelfView( { model: self } ) );
            } else {
                this.getRegion( 'self' ).empty();
            }
        },

        logout: function() {
            this.model.sip.logout();
        },

        addContact: function() {
            this.scenic.sessionChannel.commands.execute(
                'contact:add',
                _.bind( this.model.sip.addContact, this.model )
            );
        }
    } );

    return PanelView;
} );
