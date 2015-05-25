"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableView',
    'view/scenic/pages/base/table/SourcesView',
    'view/scenic/pages/base/table/DestinationsView',
    'view/scenic/pages/sip/LoginView',
    'view/scenic/pages/sip/SIPMenus',
    'text!template/scenic/pages/sip/table.html'
], function ( _, Backbone, Marionette, TableView, SourcesView, DestinationsView, LoginView, SIPMenusView, SIPTableTemplate ) {

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

            this.addRegion('contacts', '.contacts');
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
                collection: this.model.getSourceCollection()
            }));
            this.showChildView('destinations', new DestinationsView({
                table: this.model,
                collection: this.model.getDestinationCollection()
            }));
            this.showChildView('contacts', new LoginView({
                table: this.model
            }));
        }
    } );

    return SIP;
} );
