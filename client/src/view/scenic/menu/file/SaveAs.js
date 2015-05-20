"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'model/SaveFile',
    'text!template/scenic/menu/file/saveAs.html'
], function ( _, Backbone, Marionette, SaveFile, SaveAsTemplate ) {

    /**
     * Save As
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */

    var SaveAsView = Marionette.ItemView.extend( {
        template:  _.template( SaveAsTemplate ),
        className: 'file-save-as',

        ui: {
            'name': '.name',
            'save': '.confirm'
        },

        events: {
            'click @ui.save':  'saveFile'
        },

        /**
         * Initialize
         */
        initialize: function () {
            var self = this;
            this.model = new SaveFile();
            _.defer( function() {
                $( self.ui.name ).focus();
            });
        },

        saveFile: function () {
            var self = this;
            this.model.set( 'name', this.ui.name.val() );
            this.model.saveFile( function( error ) {
                if ( !error ) {
                    self.destroy();
                }
            });
        }
    } );

    return SaveAsView;
} );
