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
            'click @ui.edit': 'editSource',
            'click @ui.remove': 'removeSource'
        },

        /**
         * Initialize
         */
        initialize: function( ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.collection = this.model.get('shmdatas');
        },

        /**
         * Edit Handler
         * @param event
         */
        editSource: function( event ) {
            this.model.edit();
        },

        /**
         * Remove Handler
         * @param event
         */
        removeSource: function( event ) {
            var self = this;
            this.scenicChannel.commands.execute( 'confirm', $.t('Are you sure you want to remove the __sourceName__ source?', {sourceName:this.model.get('name')}), function( confirmed ) {
                if ( confirmed ) {
                    self.model.destroy();
                }
            });
        }
    } );

    return Source;
} );
