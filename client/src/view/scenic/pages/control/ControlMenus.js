"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/Menus',
    'text!template/scenic/pages/control/menus.html'
], function ( _, Backbone, Marionette, MenusView, ControlMenusTemplate ) {

    /**
     * @constructor
     * @extends MenusView
     */
    var ControlMenus = MenusView.extend( {
        template: _.template( ControlMenusTemplate ),

        ui: {
            'source': '.menu.source',
            'properties': '.menu.properties'
        },

        events: {
            'click @ui.source .button': 'dropSources',
            'click @ui.source .item': 'create',
            'click @ui.properties .button': 'dropProperties',
            'click @ui.properties .item': 'create'
        },

        /**
         * Initialize
         */
        initialize: function () {
            MenusView.prototype.initialize.apply( this, arguments );
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
        },

        /**
         * Handle source creation
         *
         * @param event
         */
        create: function ( event ) {
            var id = $( event.currentTarget ).data( 'id' );
            this.closeMenu();
            this.scenicChannel.commands.execute( 'quiddity:create', app.classDescriptions.get( id ) );
        }
    } );

    return ControlMenus;
});