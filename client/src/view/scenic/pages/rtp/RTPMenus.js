"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableMenusView',
    'text!template/scenic/pages/rtp/menus.html'
], function ( _, Backbone, Marionette, TableMenusView, RTPMenusTemplate ) {

    /**
     * @constructor
     * @extends MenusView
     */
    var RTPMenus = TableMenusView.extend( {
        template: _.template( RTPMenusTemplate ),
        className: 'rtp',
        ui: {
            'source': '.menu.source',
            'destination': '.menu.destination',
            'filter': '.filter'
        },
        events: {
            'click @ui.source .button': 'dropSources',
            'click @ui.source .item': 'createSourceQuiddity',
            'click @ui.destination .button': 'createRTPDestination',
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

        /**
         * Initialize
         */
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
         * Create RTP Destination
         *
         * @param event
         */
        createRTPDestination: function ( event ) {
            this.scenicChannel.commands.execute( 'rtp:create', _.bind( this.model.createRTPDestination, this.model ) );
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

    return RTPMenus;
});