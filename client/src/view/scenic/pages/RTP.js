"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/Table',
    'view/scenic/pages/base/table/Sources',
    'view/scenic/pages/base/table/Destinations',
    'view/scenic/pages/rtp/RTPMenus'
], function ( _, Backbone, Marionette, TableView, SourcesView, DestinationsView, RTPMenus ) {

    /**
     *  @constructor
     *  @augments TableView
     */
    var RTP = TableView.extend( {

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
            this.showChildView('menus', new RTPMenus({
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

    return RTP;
} );
