"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/table/menu.html',
    'text!template/scenic/table/menu/subMenu.html'
], function ( _, Backbone, Marionette, MenuTemplate, SubMenuTemplate ) {

    /**
     *  @constructor
     *  @augments module:Marionette.LayoutView
     */
    var Menu = Marionette.ItemView.extend( {
        template: _.template( MenuTemplate ),
        ui:       {
            'menuButton': '.menuButton'
        },
        events:   {
            'click @ui.menuButton': 'dropMenu',
            'click #subMenu .create': 'create',
            "mouseleave #subMenu":  'closeMenu'
        },

        initialize: function () {
            this.scenicChannel = Backbone.Wreqr.radio.channel('scenic');
        },

        /**
         * Drop Menu
         *
         * @param event
         */
        dropMenu: function ( event ) {

            $( "#subMenu" ).remove(); //TODO: Legacy

            var menu            = $( event.currentTarget.closest( '[data-type]' ) ).data( 'type' );
            if ( !this.model.has(menu) ) {
                return;
            }

            var self = this;
            var classDescriptions = _.groupBy( app.classDescriptions.filter( function ( classDescription ) {
                return self.model.filterQuiddityOrClass( menu, classDescription );
            } ), function( item ) { return item.get('category'); } );

            if ( classDescriptions.length == 0 ) {
                return;
            }

            //TODO: Legacy
            var template = _.template( SubMenuTemplate )( {
                type:    "classes",
                classes: classDescriptions
            } );
            $( "#listSources", this.el ).remove();
            $( event.currentTarget ).after( template );
            $( '#listSources', this.el ).i18n();

            $( "#subMenu" ).accordion( {
                collapsible: true,
                active:      false,
                heightStyle: "content",
                icons:       false,
                animate:     125
            } );

            $( "#subMenu .create" ).button();
        },

        create: function( event ) {
            //this.triggerMethod('create:quiddity', collections.classDescriptions.get( $(event.currentTarget ).data('name') ) );
            this.scenicChannel.commands.execute( 'quiddity:create', app.classDescriptions.get( $(event.currentTarget ).data('name') ) );
        },

        /**
         * Close Menu
         *
         * @param event
         */
        closeMenu: function ( event ) {
            $( "#subMenu" ).remove();
        }
    } );
    return Menu;
} );
