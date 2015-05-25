"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableView',
    'view/scenic/pages/base/table/SourcesView',
    'view/scenic/pages/base/table/DestinationsView',
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
                collection: this.model.getSourceCollection()
            }));
            this.showChildView('destinations', new DestinationsView({
                table: this.model,
                collection: this.model.getDestinationCollection()
            }));
        }
    } );

    return SIP;
} );
