"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/menu/Files',
    'view/scenic/menu/file/SaveAs',
    'text!template/scenic/menu.html'
], function ( _, Backbone, Marionette, FilesView, SaveAsView, MenuTemplate ) {

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
        initialize: function (options) {
            this.scenic = options.scenic;
        },

        onAttach: function () {
            this.ui.panel.hide();
            $( ".lang[data-lang='" + localStorage.getItem( 'lang' ) + "']" ).addClass( "active" );
        },

        showFileList: function () {
            if ( this.currentPanel == 'open' ) {
                this.closePanel();
            } else {
                this.openPanel('open', new FilesView( { collection: this.scenic.saveFiles, close: _.bind( this.closePanel, this ), scenic: this.scenic } ));
            }
        },

        saveFileAs: function () {
            if ( this.currentPanel == 'save' ) {
                this.closePanel();
            } else {
                this.openPanel( 'save', new SaveAsView( { close: _.bind( this.closePanel, this ), scenic: this.scenic }) );
            }
        },

        openPanel: function(name, view) {
            this.currentPanel = name;
            this.showChildView( 'panel', view );
            this.ui.panel.fadeIn( 250 );
        },

        closePanel: function() {
            this.currentPanel = null;
            var self          = this;
            $(this.ui.panel).fadeOut( 250, function () {
                self.getRegion( 'panel' ).empty();
            } );
        },

        changeLanguage: function ( event ) {
            this.scenic.sessionChannel.commands.execute( 'set:language', $( event.currentTarget ).data( 'lang' ) );
        }
    } );

    return MenuView;
} );
