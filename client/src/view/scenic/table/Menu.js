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
     *  @augments module:Backbone.Marionette.LayoutView
     */
    var Menu = Backbone.Marionette.ItemView.extend( {
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
            var tableMenuConfig = this.model.get( menu );
            if ( !tableMenuConfig ) {
                return;
            }

            var classDescriptions = _.groupBy( _.filter( collections.classDescriptions.toJSON(), function ( classDescription ) {
                var name     = classDescription['class name'];
                var category = classDescription['category'];
                var included = tableMenuConfig.include ? _.some( tableMenuConfig.include, function ( include ) {
                    return category.indexOf( include ) != -1 || name.indexOf( include ) != -1;
                } ) : true;
                var excluded = tableMenuConfig.exclude ? _.contains( tableMenuConfig.exclude, category ) : false;
                return included && !excluded;
            } ), 'category' );

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
            this.scenicChannel.commands.execute( 'create:quiddity', collections.classDescriptions.get( $(event.currentTarget ).data('name') ) );
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
