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
            'keydown': 'checkKey',
            'click @ui.save':  'saveFile'
        },

        /**
         * Initialize
         */
        initialize: function ( options ) {
            this.close = options.close;
            this.model = new SaveFile();
        },

        onAttach: function() {
            _.defer( _.bind( this.ui.name.focus, this.ui.name ) );
        },

        saveFile: function () {
            var self = this;
            this.model.set( 'name', this.ui.name.val() );
            this.model.saveFile( function( error ) {
                if ( !error ) {
                    self.close();
                }
            });
        },

        checkKey: function( event ) {
            var key = event.which || event.keyCode;
            if ( key == 27 ) {
                event.preventDefault();
                this.close();
            }
        }
    } );

    return SaveAsView;
} );
