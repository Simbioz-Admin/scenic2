"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/menu/file.html'
], function ( _, Backbone, Marionette, FileTemplate ) {

    /**
     * File
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */

    var FileView = Marionette.ItemView.extend( {
        template: _.template(FileTemplate),
        tagName: 'li',
        className: 'file',

        ui: {
            'name': '.name',
            'remove': '.remove'
        },

        events:    {
            'click': 'loadFile'
        },

        /**
         * Initialize
         */
        initialize: function () {

        },

        loadFile: function() {
            var self = this;
            this.triggerMethod('closeList', self.model);
            this.model.loadFile();
        }
    } );

    return FileView;
} );
