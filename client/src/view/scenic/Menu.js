"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'app',
    'view/scenic/menu/Files',
    'view/scenic/menu/file/SaveAs',
    'text!template/scenic/menu.html'
], function ( _, Backbone, Marionette, app, FilesView, SaveAsView, MenuTemplate ) {

    /**
     * Menu
     *
     * @constructor
     * @extends module:Marionette.Layout
     */

    var MenuView = Marionette.LayoutView.extend( {
        template: _.template( MenuTemplate ),

        regions: {
            'panel': '.panel'
        },

        ui: {
            'panel': '.panel',
            'load':  '.load',
            'save':  '.save',
            'lang':  '.lang'
        },

        events: {
            'click @ui.load': 'showFileList',
            'click @ui.save': 'saveFileAs',
            'click @ui.lang': 'changeLanguage'
        },

        /**
         * Initialize
         */
        initialize: function () {
            // Main communication channel
            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
        },

        onAttach: function () {
            console.log( this.ui );
            this.ui.panel.hide();
            $( ".lang[data-lang='" + localStorage.getItem( 'lang' ) + "']" ).addClass( "active" );
        },

        showFileList: function () {
            if ( this.currentPanel == 'open' ) {
                this.currentPanel = null;
                var self          = this;
                this.ui.panel.fadeOut( 250 ).conplete( function () {
                    self.getRegion( 'panel' ).empty();
                } );
            } else {
                this.currentPanel = 'open';
                this.showChildView( 'panel', new FilesView( { collection: app.saveFiles } ) );
                this.ui.panel.fadeIn( 250 );
            }
        },

        saveFileAs: function () {
            if ( this.currentPanel == 'save' ) {
                this.currentPanel = null;
                var self          = this;
                this.ui.panel.fadeOut( 250 ).complete( function () {
                    self.getRegion( 'panel' ).empty();
                } );
            } else {
                this.currentPanel = 'save';
                this.showChildView( 'panel', new SaveAsView() );
                this.ui.panel.fadeIn( 250 );
            }
        },

        changeLanguage: function ( event ) {
            this.scenicChannel.commands.execute( 'set:language', $( event.currentTarget ).data( 'lang' ) );
        }
    } );

    return MenuView;
} );
