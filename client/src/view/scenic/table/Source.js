"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/table/source/Shmdata',
    'text!template/scenic/table/source.html'
], function ( _, Backbone, Marionette, ShmdataView, SourceTemplate ) {

    /**
     * Source View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var Source = Marionette.CompositeView.extend( {
        template: _.template( SourceTemplate ),
        className: 'quiddity source',
        childView: ShmdataView,
        childViewContainer: '.shmdatas',

        ui: {
            edit: '.actions .action.edit',
            remove: '.actions .action.remove'
        },

        events: {
            'click @ui.edit': 'edit',
            'click @ui.remove': 'removeQuiddity'
        },

        /**
         * Initialize
         */
        initialize: function( ) {
            this.collection = this.model.get('shmdatas');
        },

        /**
         * Edit Handler
         *
         * @param event
         */
        edit: function( event ) {
            this.model.edit();
        },

        /**
         * Remove Handler
         *
         * @param event
         */
        removeQuiddity: function( event ) {
            //TODO: Ask before
            this.model.destroy();
        }
    } );

    return Source;
} );
