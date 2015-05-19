'use strict';

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/table/menus.html',
    'text!template/scenic/table/menu/subMenu.html'
], function ( _, Backbone, Marionette, MenusTemplate, SubMenuTemplate ) {

    /**
     *  @constructor
     *  @augments module:Marionette.LayoutView
     */
    var Menus = Marionette.ItemView.extend( {
        template: _.template( MenusTemplate ),
        initialize: function () {
            this.scenicChannel   = Backbone.Wreqr.radio.channel( 'scenic' );
            this.subMenuTemplate = _.template( SubMenuTemplate );
        },

        /**
         * Map a list of models to the menu structure
         *
         * @param models
         * @returns {*}
         */
        mapMenu:          function ( models ) {
            return _.groupBy( _.map( models, function ( classDescription ) {
                return {
                    group: classDescription.get( 'category' ),
                    id:    classDescription.get( 'class name' ),
                    name:  classDescription.get( 'long name' ),
                    title: classDescription.get( 'short description' )
                };
            }, this ), 'group' );
        },

        /**
         * Drop Menu
         *
         * @param data
         */
        drop: function ( anchor, data ) {
            this.closeMenu();

            if ( data.length == 0 ) {
                return;
            }

            $( anchor ).append( this.subMenuTemplate( {
                type:    'classes',
                groups: data
            } ) );

            $( '#sub-menu .content' ).accordion( {
                collapsible: true,
                active:      false,
                heightStyle: 'content',
                icons:       false,
                animate:     125
            } );

            //TODO: Just style the link correctly
            $( '#sub-menu a' ).button();

            this.bodyClickHandler = _.bind(this.closeMenu, this);
            $('.overlay').on( 'click', this.bodyClickHandler);
        },

        /**
         * Close Menu
         *
         * @param event
         */
        closeMenu: function ( event ) {
            $( '#sub-menu' ).remove();
            $('.overlay').off( 'click', this.bodyClickHandler);
        }
    } );
    return Menus;
} );
