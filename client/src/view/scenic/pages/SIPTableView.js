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
    'view/scenic/pages/sip/PanelView',
    'view/scenic/pages/sip/SIPMenus',
    'text!template/scenic/pages/sip/table.html'
], function ( _, Backbone, Marionette, TableView, SourcesView, SIPDestinationsView, SIPConnectionView, LoginView, PanelView, SIPMenusView, SIPTableTemplate ) {

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

            this.scenic.sessionChannel.vent.on('sip:login', this._onLogin, this);
            this.scenic.sessionChannel.vent.on('sip:loggedin', this._onLoggedIn, this);
            this.scenic.sessionChannel.vent.on('sip:loggedout', this._onLoggedOut, this);

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
                scenic: this.scenic,
                model: this.model
            }));
            this.showChildView('sources', new SourcesView({
                scenic: this.scenic,
                table: this.model,
                collection: this.model.getSourceCollection(),
                connectionView: SIPConnectionView
            }));
            this.showChildView('destinations', new SIPDestinationsView({
                scenic: this.scenic,
                table: this.model,
                collection: this.model.getDestinationCollection()
            }));

            // Show SIP View depending on status
            this.showSIPView();
        },

        showSIPView: function() {
            if ( this.model.scenic.sip.get('connected') ) {
                this.showChildView('sip', new PanelView({
                    scenic: this.scenic,
                    model: this.model
                }));
            } else {
                this.showChildView('sip', new LoginView({
                    scenic: this.scenic,
                    table: this.model,
                    model: this.model.scenic.sip
                }));
            }
        },

        _onConnectedChanged : function() {
            this.showSIPView();
        },

        _onLogin: function() {

        },

        _onLoggedIn: function() {

        },

        _onLoggedOut: function( error ) {
        }
    } );

    return SIP;
} );
