"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/TableMenusView',
    'text!template/scenic/pages/sip/menus.html'
], function ( _, Backbone, Marionette, TableMenusView, SIPMenusTemplate ) {

    /**
     * @constructor
     * @extends MenusView
     */
    var SIPMenusView = TableMenusView.extend( {
        template: _.template( SIPMenusTemplate ),
        ui: {
            'source': '.menu.source',
            'destination': '.menu.destination',
            'filter': '.filter-select'
        },
        events: {
            'click @ui.source .button': 'dropSources',
            'click @ui.source .item': 'createSourceQuiddity',
            'click @ui.destination .button': 'dropDestinations',
            'click @ui.destination .item': 'addContactDestination',
            'change @ui.filter': 'filter'
        },

        templateHelpers: function () {
            var categories = _.uniq( _.map( this.quiddities.filter( function ( quiddity ) {
                return this.model.filterSource( quiddity ) || this.model.filterDestination( quiddity );
            }, this ), function ( quiddity ) {
                return quiddity.get( 'classDescription' ).get( 'category' );
            } ) );
            return {
                categories: categories
            }
        },
        
        initialize: function (options) {
            TableMenusView.prototype.initialize.apply( this, arguments );
            this.quiddities = this.model.scenic.quiddities;
            this.listenTo( this.quiddities, 'update', this.render );
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
         * Drop the destinations menu
         *
         * @param event
         */
        dropDestinations: function ( event ) {
            this.drop( this.ui.destination, _.groupBy( this.model.getDestinations().map( function ( contact ) {
                return {
                    id: contact.id,
                    name: contact.get( 'name' ),
                    status: contact.get('status')
                };
            }, this ), 'status' ), 0 );
        },

        /**
         * Add a contact destination
         *
         * @param event
         */
        addContactDestination: function(event) {
            this.closeMenu();
            this.model.addDestination( this.model.sip.contacts.get( $( event.currentTarget ).data( 'id' ) ) );
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

    return SIPMenusView;
});