"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/Table',
    'view/scenic/pages/base/table/Sources',
    'view/scenic/pages/base/table/Destinations',
    'view/scenic/pages/sip/SIPMenus',
], function ( _, Backbone, Marionette, TableView, SourcesView, DestinationsView, SIPMenus ) {

    /**
     *  @constructor
     *  @augments TableView
     */
    var SIP = TableView.extend( {

        /**
         * Initialize
         */
        initialize: function( ) {
            TableView.prototype.initialize.apply(this,arguments);
        },

        /**
         * Before Show Handler
         *
         * @private
         */
        onBeforeShow: function( ) {
            this.showChildView('menus', new SIPMenus({
                model: this.model
            }));
            this.showChildView('sources', new SourcesView({
                table: this.model,
                collection: app.quiddities
            }));
            this.showChildView('destinations', new DestinationsView({
                table: this.model,
                collection: app.quiddities
            }));
        }
    } );

    return SIP;
} );
