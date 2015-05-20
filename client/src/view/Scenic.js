"use strict";

define( [
    // Lib
    'underscore',
    'backbone',
    'marionette',
    'lib/spin',
    // Model
    'model/Pages',
    'model/pages/Sink',
    'model/pages/RTP',
    'model/pages/SIP',
    'model/pages/Control',
    'model/pages/Settings',
    // View
    'view/scenic/pages/SinkTableView',
    'view/scenic/pages/RTPTableView',
    'view/scenic/pages/SIPTableView',
    'view/scenic/pages/ControlTableView',
    'view/scenic/pages/SettingsTableView',
    'view/scenic/Menu',
    'view/scenic/Tabs',
    'view/scenic/SystemUsage',
    'view/scenic/Notifications',
    'view/scenic/Inspector',
    'view/scenic/modal/Confirmation',
    // Template
    'text!template/scenic.html'
], function ( _, Backbone, Marionette, spin,
              Pages,
              SinkPage, RTPPage, SIPPage, ControlPage, SettingsPage,
              SinkView, RTPView, SIPView, ControlView, SettingsView,
              MenuView, TabsView, SystemUsageView, NotificationsView, InspectorView, ConfirmationView,
              ScenicTemplate ) {

    /**
     * @constructor
     * @augments module:Marionette.LayoutView
     */
    var ScenicView = Marionette.LayoutView.extend( {
        template: _.template(ScenicTemplate),
        el:       '#scenic',

        regions: {
            tabs:      '#tabs',
            usage:     '#usage',
            menu:      '#header .menu',
            page:      '#page',
            inspector: '#inspector',
            modal:     '#modal'
        },

        initialize: function ( app ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            this.app = app;

            this.notifications = new NotificationsView();

            this.pages = new Pages( null, {config: this.app.config });
            this.pages.add( new SinkPage( {viewClass: SinkView} ) );
            this.pages.add( new RTPPage( {viewClass: RTPView} ) );
            this.pages.add( new SIPPage( {viewClass: SIPView} ) );
            this.pages.add( new ControlPage( {viewClass: ControlView} ) );
            this.pages.add( new SettingsPage( {viewClass: SettingsView} ) );

            this.pages.on( 'change:current', _.bind( this.showPage, this ) );

            // Wreqr Handlers
            this.scenicChannel.commands.setHandler( 'confirm', this._onConfirm, this );

            //TODO: Put in notification manager
            this.scenicChannel.vent.on( 'quiddity:added', this._onQuiddityAdded, this );
            this.scenicChannel.vent.on( 'quiddity:removed', this._onQuiddityRemoved, this );
            this.scenicChannel.vent.on( 'file:loading', this._onFileLoading, this );
            this.scenicChannel.vent.on( 'file:loaded', this._onFileLoaded, this );
            this.scenicChannel.vent.on( 'file:error', this._onFileError, this );

            // TODO: Legacy
            $( document ).tooltip();
            $( ".lang[data-lang='" + localStorage.getItem( 'lang' ) + "']" ).addClass( "active" );
        },

        /**
         * Render
         * Special case for the moment as we don't use a master application view to render us
         */
        onRender: function () {
            this.showChildView( 'menu', new MenuView( ) );
            this.showChildView( 'tabs', new TabsView( { collection: this.pages } ) );
            this.showChildView( 'usage', new SystemUsageView() );
            this.showChildView( 'inspector', new InspectorView() );

            this.showPage( this.pages.getCurrentPage() );

            this.$el.fadeIn(500);
        },

        /**
         * Current page change handler
         * Displays the current page
         *
         * @param page
         * @private
         */
        showPage: function ( page ) {
            if ( page ) {
                this.showChildView( 'page', page.getViewInstance() );
            } else {
                this.getRegion('page' ).empty();
            }
        },

        //  ███╗   ███╗ ██████╗ ██████╗  █████╗ ██╗
        //  ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║
        //  ██╔████╔██║██║   ██║██║  ██║███████║██║
        //  ██║╚██╔╝██║██║   ██║██║  ██║██╔══██║██║
        //  ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║  ██║███████╗
        //  ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝

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
            this.showChildView( 'modal', new ConfirmationView( {
                message:  message,
                callback: _.bind( this.closeModal, this, callback )
            } ) );
        },

        /**
         * Close Modal
         *
         * @param callback
         * @param result
         */
        closeModal: function ( callback, result ) {
            this.$el.addClass( 'blur' );
            this.getRegion( 'modal' ).empty();
            callback( result );
        },

        //   ██████╗ ██╗   ██╗██╗██████╗ ██████╗ ██╗████████╗██╗███████╗███████╗
        //  ██╔═══██╗██║   ██║██║██╔══██╗██╔══██╗██║╚══██╔══╝██║██╔════╝██╔════╝
        //  ██║   ██║██║   ██║██║██║  ██║██║  ██║██║   ██║   ██║█████╗  ███████╗
        //  ██║▄▄ ██║██║   ██║██║██║  ██║██║  ██║██║   ██║   ██║██╔══╝  ╚════██║
        //  ╚██████╔╝╚██████╔╝██║██████╔╝██████╔╝██║   ██║   ██║███████╗███████║
        //   ╚══▀▀═╝  ╚═════╝ ╚═╝╚═════╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝╚══════╝╚══════╝

        /**
         * Quiddity Added Handler
         *
         * @param quiddity
         * @private
         */
        _onQuiddityAdded: function ( quiddity ) {
            if ( quiddity.get( 'name' ).indexOf( 'vumeter_' ) != -0 ) {
                this.scenicChannel.vent.trigger( 'success', $.t( 'Quiddity __name__ added', {name: quiddity.get( 'name' )} ) );
            }
        },

        /**
         * Quiddity Removed Handler
         *
         * @param quiddity
         * @private
         */
        _onQuiddityRemoved: function ( quiddity ) {
            if ( quiddity.get( 'name' ).indexOf( 'vumeter_' ) != -0 ) {
                this.scenicChannel.vent.trigger( 'success', $.t( 'Quiddity __name__ removed', {name: quiddity.get( 'name' )} ) );
            }
        },

        //  ███████╗██╗██╗     ███████╗███████╗
        //  ██╔════╝██║██║     ██╔════╝██╔════╝
        //  █████╗  ██║██║     █████╗  ███████╗
        //  ██╔══╝  ██║██║     ██╔══╝  ╚════██║
        //  ██║     ██║███████╗███████╗███████║
        //  ╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝

        /**
         * File Loading Handler
         *
         * @param fileName
         * @private
         */
        _onFileLoading: function( fileName ) {
            this.stopSpinner = spin();
        },

        /**
         * File Loaded Handler
         * @param fileName
         * @private
         */
        _onFileLoaded: function( fileName ) {
            this.stopSpinner();
        },

        /**
         * File Error Handler
         *
         * @param fileName
         * @private
         */
        _onFileError: function( fileName ) {
            this.stopSpinner();
        }
    } );
    return ScenicView;
} );
