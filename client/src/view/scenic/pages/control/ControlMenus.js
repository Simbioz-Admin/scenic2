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
            'click @ui.source .item': 'createSourceQuiddity',
            'click @ui.properties .button': 'dropProperties',
            'click @ui.properties .item': 'createControlDestination'
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
                    id: property.id,
                    name: property.get( 'name' ),
                    title: property.get( 'description' )
                };
            }, this ), 'group' ) );
        }

    } );

    return ControlMenus;
});