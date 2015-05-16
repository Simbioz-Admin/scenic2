"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/Tabs',
    'view/scenic/SystemUsage',
    'view/scenic/Table',
    'view/scenic/Inspector'
], function ( _, Backbone, Marionette, TabsView, SystemUsageView, TableView, InspectorView ) {

    /**
     *  @constructor
     *  @augments module:Marionette.LayoutView
     */
    var ScenicView = Marionette.LayoutView.extend( {
        el:       '#scenic',
        template: false,

        regions: {
            tabs:      '#tabs',
            usage:     '#usage',
            menu:      '#header .menu',
            table:     '#main',
            inspector: '#inspector'
        },

        initialize: function ( app ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            this.app = app;
            this.app.tables.on( 'change:current', _.bind( this._onShowTable, this ) );

            // Wreqr Handlers
            this.scenicChannel.vent.on( 'notify', _.bind( this._onNotify, this ) );
            this.scenicChannel.vent.on( 'success', _.bind( this._onSuccess, this ) );
            this.scenicChannel.vent.on( 'error', _.bind( this._onError, this ) );

            //TODO: Put in notification manager
            this.scenicChannel.vent.on( 'quiddity:added', _.bind( this._onQuiddityAdded, this ) );
        },

        /**
         * Before Render
         * Special case for the moment as we don't use a master application view to render us
         */
        onBeforeRender: function () {
            this.showChildView( 'tabs', new TabsView( {collection: this.app.tables} ) );
            this.showChildView( 'usage', new SystemUsageView() );
            this.showChildView( 'table', new TableView( {model: this.app.tables.getCurrentTable()} ) );
            this.showChildView( 'inspector', new InspectorView() );
        },

        /**
         * Current table change handler
         * Displays the current table
         *
         * @param table
         * @private
         */
        _onShowTable: function ( table ) {
            this.showChildView( 'table', new TableView( {model: table} ) );
        },

        /**
         * Notification Handler
         * Displays a notification
         *
         * @param message
         * @private
         */
        _onNotify: function ( message ) {
            console.log( message );
        },

        /**
         * Success Handler
         * Displays a notification
         *
         * @param message
         * @private
         */
        _onSuccess: function ( message ) {
            console.info( message );
        },

        /**
         * Error Handler
         * Displays a notification
         *
         * @param message
         * @private
         */
        _onError: function ( message ) {
            console.error( message );
        },

        /**
         * Quiddity Created Handler
         *
         * @param quiddity
         * @private
         */
        _onQuiddityAdded: function ( quiddity ) {
            console.info( i18n.t( 'Quiddity __name__ added', {name: quiddity.get( 'name' )} ) );
        }
    } );
    return ScenicView;
} );
