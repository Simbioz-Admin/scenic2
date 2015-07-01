"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableMenusView',
    'text!template/scenic/pages/control/menus.html'
], function ( _, Backbone, Marionette, TableMenusView, ControlMenusTemplate ) {

    /**
     * @constructor
     * @extends TableMenusView
     */
    var ControlMenusView = TableMenusView.extend( {
        template: _.template( ControlMenusTemplate ),

        ui: {
            'source': '.menu.source',
            'properties': '.menu.properties',
            'filter': '.filter-select'
        },

        events: {
            'click @ui.source .button': 'dropSources',
            'click @ui.source .item': 'createSourceQuiddity',
            'click @ui.properties .button': 'dropProperties',
            'click @ui.properties .item': 'createControlDestination',
            'change @ui.filter': 'filter'
        },

        templateHelpers: function () {
            var categories = _.uniq( _.map( app.quiddities.filter( function ( quiddity ) {
                return this.model.filterSource( quiddity ) || this.model.filterDestination( quiddity );
            }, this ), function ( quiddity ) {
                return quiddity.get( 'classDescription' ).get( 'category' );
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
        },

        onRender: function() {
            var self = this;
            this.ui.filter.selectmenu( {
                change: function ( event, ui ) {
                    self.model.set( 'filter', ui.item.value );
                }
            });
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
         * Drop the properties menu
         *
         * @param event
         */
        dropProperties: function ( event ) {
            //TODO: Show message when empty
            // Map for the menu structure
            this.drop( this.ui.properties, _.groupBy( _.map( this.model.getControlProperties(), function ( property ) {
                return {
                    group: property.collection.quiddity.id,
                    id: property.id,
                    name: property.get( 'name' ),
                    title: property.get( 'description' )
                };
            }, this ), 'group' ) );
        },

        createControlDestination: function(event) {
            this.closeMenu();
            this.model.createPropertyDestination( $( event.currentTarget ).data( 'group' ), $( event.currentTarget ).data( 'id' ) );
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

    return ControlMenusView;
});