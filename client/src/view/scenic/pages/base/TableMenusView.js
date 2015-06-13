'use strict';

define( [
    'underscore',
    'backbone',
    'marionette',
    'app',
    'text!template/scenic/pages/base/menu/subMenu.html'
], function ( _, Backbone, Marionette, app, SubMenuTemplate ) {

    /**
     *  @constructor
     *  @augments module:Marionette.LayoutView
     */
    var Menus = Marionette.ItemView.extend( {
        initialize: function (options) {
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
                    id:    classDescription.get( 'class' ),
                    name:  classDescription.get( 'name' ),
                    title: classDescription.get( 'description' ),
                    group: classDescription.get( 'category' )
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
        },

        /**
         * Handle source creation
         *
         * @param event
         */
        createSourceQuiddity: function ( event ) {
            this.closeMenu();
            this.scenicChannel.commands.execute(
                'quiddity:create',
                this.model.scenic.classes.get( $( event.currentTarget ).data( 'id' ) ),
                _.bind( this.model.createQuiddity, this.model )
            );
        },

        /**
         * Handle destination creation
         *
         * @param event
         */
        createDestinationQuiddity: function ( event ) {
            this.closeMenu();
            this.scenicChannel.commands.execute(
                'quiddity:create',
                this.model.scenic.classes.get( $( event.currentTarget ).data( 'id' ) ),
                _.bind( this.model.createQuiddity, this.model )
            );
        }
    } );
    return Menus;
} );
