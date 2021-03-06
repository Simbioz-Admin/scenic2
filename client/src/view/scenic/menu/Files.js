"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/menu/File',
    'text!template/scenic/menu/files.html'
], function ( _, Backbone, Marionette, FileView, FilesTemplate ) {

    /**
     * Files View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */

    var FilesView = Marionette.CompositeView.extend( {
        template:  _.template( FilesTemplate ),
        className: 'file-open',
        childView: FileView,
        childViewContainer: '.files',
        childViewOptions: function() {
            return {
                scenic: this.scenic
            }
        },

        childEvents: {
            'closeList': 'close'
        },

        /**
         * Initialize
         */
        initialize: function ( options ) {
            this.scenic = options.scenic;
            this.close = options.close;
            this.render();
        }
    } );

    return FilesView;
} );
