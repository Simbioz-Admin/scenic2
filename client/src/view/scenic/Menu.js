"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/menu/Files',
    'view/scenic/menu/file/SaveAs',
    'text!template/scenic/menu.html'
], function ( _, Backbone, Marionette, FilesView,  SaveAsView, MenuTemplate ) {

    /**
     * Menu
     *
     * @constructor
     * @extends module:Marionette.Layout
     */

    var MenuView = Marionette.LayoutView.extend( {
        template: _.template(MenuTemplate),

        regions: {
            'panel': '.panel'
        },

        ui : {
            'info': '.info',
            'load': '.load',
            'save': '.save',
            'lang': '.lang'
        },

        events:    {
            'click @ui.load': 'showFileList',
            'click @ui.save': 'saveFileAs'
        },

        /**
         * Initialize
         */
        initialize: function () {

        },

        showFileList: function() {
            this.showChildView( 'panel', new FilesView( { collection: app.saveFiles } ) );
        },

        saveFileAs: function() {
            this.showChildView( 'panel', new SaveAsView() );
        }
    } );

    return MenuView;
} );
