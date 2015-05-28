"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableView',
    'view/scenic/pages/base/table/SourcesView',
    'view/scenic/pages/sip/SIPDestinationsView',
    'view/scenic/pages/sip/SIPConnectionView',
    'view/scenic/pages/sip/LoginView',
    'view/scenic/pages/sip/ContactsView',
    'view/scenic/pages/sip/SIPMenus',
    'text!template/scenic/pages/sip/table.html'
], function ( _, Backbone, Marionette, TableView, SourcesView, SIPDestinationsView, SIPConnectionView, LoginView, ContactsView, SIPMenusView, SIPTableTemplate ) {

    /**
     *  @constructor
     *  @augments TableView
     */
    var SIP = TableView.extend( {

        template:  _.template( SIPTableTemplate ),
        className: 'table sip',

        /**
         * Initialize
         */
        initialize: function( ) {
            TableView.prototype.initialize.apply(this,arguments);

            this.scenicChannel.vent.on('sip:login', this._onLogin, this);
            this.scenicChannel.vent.on('sip:loggedin', this._onLoggedIn, this);
            this.scenicChannel.vent.on('sip:loggedout', this._onLoggedOut, this);

            this.addRegion('sip', '.sip-panel');

            this.listenTo( this.model.sip, 'change:connected', this._onConnectedChanged );
        },

        /**
         * Before Show Handler
         *
         * @private
         */
        onBeforeShow: function( ) {
            this.showChildView('menus', new SIPMenusView({
                model: this.model
            }));
            this.showChildView('sources', new SourcesView({
                table: this.model,
                collection: this.model.getSourceCollection(),
                connectionView: SIPConnectionView
            }));
            this.showChildView('destinations', new SIPDestinationsView({
                table: this.model,
                collection: this.model.getDestinationCollection()
            }));

            // Show SIP View depending on status
            this.showSIPView();
        },

        showSIPView: function() {
            if ( this.model.sip.get('connected') ) {
                this.showChildView('sip', new ContactsView({
                    table: this.model,
                    model: this.model.sip,
                    collection: this.model.sip.get('contacts')
                }));
            } else {
                this.showChildView('sip', new LoginView({
                    model: this.model
                }));
            }
        },

        _onConnectedChanged : function() {
            // Show SIP View depending on status
            this.showSIPView();
        },

        _onLogin: function() {
            /*this.showChildView('sip', new LoginView({
                table: this.model
            }));*/
        },

        _onLoggedIn: function() {

        },

        _onLoggedOut: function( error ) {
        }
    } );

    return SIP;
} );
