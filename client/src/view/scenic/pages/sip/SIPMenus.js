"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableMenus',
    'text!template/scenic/pages/sip/menus.html'
], function ( _, Backbone, Marionette, TableMenusView, SIPMenusTemplate ) {

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
            'click @ui.source .item': 'create',
            'click @ui.destination .button': 'dropDestinations',
            'click @ui.destination .item': 'create',
            'change @ui.filter': 'filter'
        },

        templateHelpers: function () {
            var categories = _.uniq( _.map( app.quiddities.filter( function ( quiddity ) {
                return this.model.filterQuiddityOrClass( 'source', quiddity ) || this.model.filterQuiddityOrClass( 'destination', quiddity );
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
         * Handle source/destination creation
         *
         * @param event
         */
        create: function ( event ) {
            var id = $( event.currentTarget ).data( 'id' );
            this.closeMenu();
            this.scenicChannel.commands.execute( 'quiddity:create', app.classDescriptions.get( id ) );
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