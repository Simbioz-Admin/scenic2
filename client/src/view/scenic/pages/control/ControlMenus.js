"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableMenus',
    'text!template/scenic/pages/control/menus.html'
], function ( _, Backbone, Marionette, TableMenusView, ControlMenusTemplate ) {

    /**
     * @constructor
     * @extends MenusView
     */
    var ControlMenus = TableMenusView.extend( {
        template: _.template( ControlMenusTemplate ),

        ui: {
            'source': '.menu.source',
            'properties': '.menu.properties'
        },

        events: {
            'click @ui.source .button': 'dropSources',
            'click @ui.source .item': 'createQuidditySource',
            'click @ui.properties .button': 'dropProperties',
            'click @ui.properties .item': 'create'
        },

        /**
         * Initialize
         */
        initialize: function () {
            TableMenusView.prototype.initialize.apply( this, arguments );
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
                    group: property.collection.quiddity.get( 'name' ),
                    id: property.get( 'name' ),
                    name: property.get( 'long name' ),
                    title: property.get( 'short description' )
                };
            }, this ), 'group' ) );
        }

    } );

    return ControlMenus;
});