"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'text!template/scenic/menu/file.html'
], function ( _, Backbone, Marionette, i18n, FileTemplate ) {

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
            'click': 'loadFile',
            'click @ui.remove': 'removeFile'
        },

        /**
         * Initialize
         */
        initialize: function (options) {
            this.scenic = options.scenic;
        },

        loadFile: function() {
            var self = this;
            this.triggerMethod('closeList', self.model);
            this.model.loadFile();
        },

        removeFile: function(event) {
            event.stopImmediatePropagation();
            var self = this;
            this.scenic.scenicChannel.commands.execute( 'confirm', i18n.t('Are you sure you want to delete __file__?', {file:this.model.get('name')}), function( confirmed ) {
                if ( confirmed ) {
                    self.model.destroy();
                }
            });
        }
    } );

    return FileView;
} );
