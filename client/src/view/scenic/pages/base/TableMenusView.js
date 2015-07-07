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
    var TableMenusView = Marionette.ItemView.extend( {
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
            return _.groupBy( _.map( models, function ( model ) {
                return {
                    id:    model.get( 'class' ),
                    name:  model.get( 'name' ),
                    title: model.get( 'description' ),
                    group: model.get( 'category' )
                };
            }, this ), 'group' );
        },

        /**
         * Drop Menu
         *
         * @param data
         */
        drop: function ( anchor, data, activeIndex ) {
            this.closeMenu();

            if ( data.length == 0 ) {
                return;
            }

            $( anchor ).append( this.subMenuTemplate( {
                groups: data
            } ) );

            $( '#sub-menu .content' ).accordion( {
                collapsible: true,
                active:      activeIndex != null ? activeIndex : false,
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
                app.classDescriptions.get( $( event.currentTarget ).data( 'id' ) ),
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
                app.classDescriptions.get( $( event.currentTarget ).data( 'id' ) ),
                _.bind( this.model.createQuiddity, this.model )
            );
        }
    } );

    return TableMenusView;
} );
