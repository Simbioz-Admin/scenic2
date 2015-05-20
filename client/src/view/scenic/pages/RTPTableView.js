"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/Table',
    'view/scenic/pages/base/table/Sources',
    'view/scenic/pages/rtp/RTPDestinationsView',
    'view/scenic/pages/rtp/RTPMenus'
], function ( _, Backbone, Marionette, TableView, SourcesView, RTPDestinationsView, RTPMenus ) {

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
                collection: this.model.getSourceCollection()
            }));
            this.showChildView('destinations', new RTPDestinationsView({
                table: this.model,
                collection: this.model.getDestinationCollection()
            }));
        }
    } );

    return RTP;
} );
