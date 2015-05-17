"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/Tabs',
    'view/scenic/SystemUsage',
    'view/scenic/Table',
    'view/scenic/Inspector',
    'view/scenic/modal/Confirmation'
], function ( _, Backbone, Marionette, TabsView, SystemUsageView, TableView, InspectorView, ConfirmationView ) {

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
            inspector: '#inspector',
            modal:     '#modal'
        },

        initialize: function ( app ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            this.app = app;
            this.app.tables.on( 'change:current', _.bind( this._onShowTable, this ) );

            // Wreqr Handlers
            this.scenicChannel.vent.on( 'notify', this._onNotify, this );
            this.scenicChannel.vent.on( 'success', this._onSuccess, this );
            this.scenicChannel.vent.on( 'error', this._onError, this );
            this.scenicChannel.commands.setHandler( 'confirm', this._onConfirm, this );

            //TODO: Put in notification manager
            this.scenicChannel.vent.on( 'quiddity:added', this._onQuiddityAdded, this );

            // TODO: Legacy
            $( document ).tooltip();
            $( ".lang[data-lang='" + localStorage.getItem( 'lang' ) + "']" ).addClass( "active" );

            // Notifications
            var type = 'error';
            var msg  = 'Reimplement notifications';
            $( "#msgHighLight" ).remove();
            this.$el.append( "<div id='msgHighLight' class='" + type + "'>" + msg + "</div>" );
            setTimeout( function () {
                $( '#msgHighLight' ).addClass( 'active' ).delay( 4000 ).queue( function ( next ) {
                    $( this ).removeClass( "active" );
                } );
            }, 0 )
            $( "#msgHighLight" ).click( function () {
                $( this ).remove();
            } )
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
         * Confirmation Handler
         * Shows a modal to confirm an action
         *
         * @param message
         * @param callback
         * @private
         */
        _onConfirm: function ( message, callback ) {
            if ( !callback ) {
                callback = message;
                message  = $.t( 'Are you sure?"' );
            }
            this.$el.addClass( 'blur' );
            this.showChildView( 'modal', new ConfirmationView( { message: message, callback: _.bind( this.closeModal, this, callback ) } ) );
        },

        /**
         * Close Modal
         *
         * @param callback
         * @param result
         */
        closeModal: function( callback, result ) {
            this.$el.addClass( 'blur' );
            this.getRegion('modal' ).empty();
            callback( result );
        },

        /**
         * Quiddity Created Handler
         *
         * @param quiddity
         * @private
         */
        _onQuiddityAdded: function ( quiddity ) {
            console.info( $.t( 'Quiddity __name__ added', {name: quiddity.get( 'name' )} ) );
        }
    } );
    return ScenicView;
} );
