"use strict";

define( [
    // Lib
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'lib/spin',
    // App
    'app',
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
    // Template
    'text!template/scenic.html'
], function ( _, Backbone, Marionette, i18n, spin,
              app,
              Pages,
              SinkPage, RTPPage, SIPPage, ControlPage, SettingsPage,
              SinkView, RTPView, SIPView, ControlView, SettingsView,
              MenuView, TabsView, SystemUsageView, NotificationsView, InspectorView,
              ScenicTemplate ) {

    /**
     * @constructor
     * @augments module:Marionette.LayoutView
     */
    var ScenicView = Marionette.LayoutView.extend( {
        template: _.template( ScenicTemplate ),

        regions: {
            tabs:      '#tabs',
            usage:     '#usage',
            menu:      '#header .menu',
            page:      '#page',
            inspector: '#inspector'
        },

        initialize: function ( scenic ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            this.scenic = scenic;

            this.notifications = new NotificationsView();

            this.pages = new Pages( null, {scenic: scenic} );
            this.pages.add( new SinkPage( null, {scenic: scenic, viewClass: SinkView} ) );
            this.pages.add( new RTPPage( null, {scenic: scenic, viewClass: RTPView} ) );
            this.pages.add( new SIPPage( null, {scenic: scenic, viewClass: SIPView} ) );
            this.pages.add( new ControlPage( null, {scenic: scenic, viewClass: ControlView} ) );
            this.pages.add( new SettingsPage( null, {scenic: scenic, viewClass: SettingsView} ) );

            this.pages.on( 'change:current', _.bind( this.showPage, this ) );

            // Wreqr Handlers
            this.scenicChannel.commands.setHandler( 'set:language', this.setLanguage, this );

            //TODO: Put in notification manager
            this.scenicChannel.vent.on( 'quiddity:added', this._onQuiddityAdded, this );
            this.scenicChannel.vent.on( 'quiddity:removed', this._onQuiddityRemoved, this );
            this.scenicChannel.vent.on( 'file:added', this._onFileAdded, this );
            this.scenicChannel.vent.on( 'file:removed', this._onFileRemoved, this );
            this.scenicChannel.vent.on( 'file:loading', this._onFileLoading, this );
            this.scenicChannel.vent.on( 'file:loaded', this._onFileLoaded, this );
            this.scenicChannel.vent.on( 'file:load:error', this._onFileLoadError, this );
        },

        /**
         * Render
         * Special case for the moment as we don't use a master application view to render us
         */
        onRender: function () {
            this.showChildView( 'menu', new MenuView( {scenic: this.scenic} ) );
            this.showChildView( 'tabs', new TabsView( {collection: this.pages} ) );
            this.showChildView( 'usage', new SystemUsageView( {scenic: this.scenic} ) );
            this.showChildView( 'inspector', new InspectorView() );

            this.showPage( this.pages.getCurrentPage() );
        },

        /**
         * Current page change handler
         * Displays the current page
         *
         * @param page
         * @private
         */
        showPage: function ( page ) {
            if ( this.currentPage ) {
                this.$el.removeClass( this.currentPage.id );
            }
            if ( page ) {
                this.showChildView( 'page', page.getViewInstance() );
                this.currentPage = page;
            } else {
                this.getRegion( 'page' ).empty();
                this.currentPage = null;
            }
            if ( this.currentPage ) {
                this.$el.addClass( this.currentPage.id );
            }
        },

        setLanguage: function ( language ) {
            if ( !_.contains( this.scenic.config.locale.supported, language ) ) {
                console.warn( 'Invalid language', language );
            }
            var currentLanguage = localStorage.getItem( 'lang' );
            if ( currentLanguage != language ) {
                localStorage.setItem( 'lang', language );
                location.reload();
            }
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
            this.scenicChannel.vent.trigger( 'success', i18n.t( 'Quiddity __name__ added', {name: quiddity.id} ) );
        },

        /**
         * Quiddity Removed Handler
         *
         * @param quiddity
         * @private
         */
        _onQuiddityRemoved: function ( quiddity ) {
            this.scenicChannel.vent.trigger( 'success', i18n.t( 'Quiddity __name__ removed', {name: quiddity.id} ) );
        },

        //  ███████╗██╗██╗     ███████╗███████╗
        //  ██╔════╝██║██║     ██╔════╝██╔════╝
        //  █████╗  ██║██║     █████╗  ███████╗
        //  ██╔══╝  ██║██║     ██╔══╝  ╚════██║
        //  ██║     ██║███████╗███████╗███████║
        //  ╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝

        /**
         * File Added Handler
         *
         * @param file
         * @private
         */
        _onFileAdded: function ( file ) {
            this.scenicChannel.vent.trigger( 'info', i18n.t( 'File __name__ added', {name: file.id} ) );
        },

        /**
         * File Removed Handler
         *
         * @param file
         * @private
         */
        _onFileRemoved: function ( file ) {
            this.scenicChannel.vent.trigger( 'info', i18n.t( 'File __name__ removed', {name: file.id} ) );
        },

        /**
         * File Loading Handler
         *
         * @param {SaveFile} file
         * @private
         */
        _onFileLoading: function ( file ) {
            this.scenicChannel.vent.trigger( 'info', i18n.t( 'Loading file __name__', {name: file.get( 'name' )} ) );
            this.stopSpinner = spin();
        },

        /**
         * File Loaded Handler
         * @param {SaveFile} file
         * @private
         */
        _onFileLoaded: function ( file ) {
            this.scenicChannel.vent.trigger( 'success', i18n.t( 'File __name__ loaded successfully', {name: file.get( 'name' )} ) );
            this.stopSpinner();
        },

        /**
         * File Error Handler
         *
         * @param {SaveFile} file
         * @private
         */
        _onFileLoadError: function ( file ) {
            this.scenicChannel.vent.trigger( 'error', i18n.t( 'Could not load file __name__', {name: file.get( 'name' )} ) );
            if ( this.stopSpinner ) {
                this.stopSpinner();
            }
        }
    } );
    return ScenicView;
} );