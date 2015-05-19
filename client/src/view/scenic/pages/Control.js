"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/Table',
    'view/scenic/pages/base/Menus',
    'view/scenic/table/Sources',
    'view/scenic/table/Destinations',
    'text!template/scenic/pages/control/menus.html'
], function ( _, Backbone, Marionette, TableView, MenusView, SourcesView, DestinationsView, ControlMenusTemplate ) {

    /**
     * @constructor
     * @extends MenusView
     */
    var ControlMenus = MenusView.extend( {
        template:        _.template( ControlMenusTemplate ),

        ui:              {
            'source':     '.menu.source',
            'properties': '.menu.properties',
        },

        events:          {
            'click @ui.source .button':     'dropSources',
            'click @ui.source .item':       'create',
            'click @ui.properties .button': 'dropProperties',
            'click @ui.properties .item':   'create',
        },

        /**
         * Initialize
         */
        initialize:      function () {
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
                    id:    property.get( 'name' ),
                    name:  property.get( 'long name' ),
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

    /**
     *  @constructor
     *  @augments TableView
     */
    var Control = TableView.extend( {

        /**
         * Initialize
         */
        initialize: function () {
            TableView.prototype.initialize.apply( this, arguments );
        },

        /**
         * Before Show Handler
         *
         * @private
         */
        onBeforeShow: function () {
            this.showChildView( 'menus', new ControlMenus( {
                model: this.model
            } ) );
            this.showChildView( 'sources', new SourcesView( {
                table:      this.model,
                collection: app.quiddities
            } ) );
            this.showChildView( 'destinations', new DestinationsView( {
                table:      this.model,
                collection: app.quiddities
            } ) );
        }
    } );

    return Control;
} );
