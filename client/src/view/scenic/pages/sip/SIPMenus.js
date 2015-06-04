"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'app',
    'view/scenic/pages/base/TableMenusView',
    'text!template/scenic/pages/sip/menus.html'
], function ( _, Backbone, Marionette, app, TableMenusView, SIPMenusTemplate ) {

    /**
     * @constructor
     * @extends MenusView
     */
    var SIPMenus = TableMenusView.extend( {
        template: _.template( SIPMenusTemplate ),
        ui: {
            'source': '.menu.source',
            'destination': '.menu.destination',
            'filter': '.filter'
        },
        events: {
            'click @ui.source .button': 'dropSources',
            'click @ui.source .item': 'createSourceQuiddity',
            'click @ui.destination .button': 'dropDestinations',
            'click @ui.destination .item': 'create',
            'change @ui.filter': 'filter'
        },

        templateHelpers: function () {
            var categories = _.uniq( _.map( app.quiddities.filter( function ( quiddity ) {
                return this.model.filterSource( quiddity ) || this.model.filterDestination( quiddity );
            }, this ), function ( quiddity ) {
                return quiddity.get( 'category' );
            } ) );
            return {
                categories: categories
            }
        },
        initialize: function () {
            TableMenusView.prototype.initialize.apply( this, arguments );
            this.listenTo( app.quiddities, 'update', this.render );
        },

        /**
         * Drop the sources menu
         *
         * @param event
         */
        dropSources: function ( event ) {
            this.drop( this.ui.source, this.mapMenu( this.model.getSources() ) );
        },

        /**
         * Drop the destinations menu
         *
         * @param event
         */
        dropDestinations: function ( event ) {
            this.drop( this.ui.destination, this.mapMenu( this.model.getDestinations() ) );
        },

        /**
         * Filter table
         *
         * @param event
         */
        filter: function ( event ) {
            this.model.set( 'filter', $( event.currentTarget ).val() );
        }
    } );

    return SIPMenus;
});