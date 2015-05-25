"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/source/ShmdataView',
    'text!template/scenic/pages/base/table/source.html'
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
        childViewOptions: function() {
            return {
                table: this.options.table,
                collection: this.options.table.getDestinationCollection()
            }
        },
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

            // Check for started property
            var startedProperty = this.model.get('properties' ).findWhere({name:'started'});
            if ( startedProperty ) {
                this.listenTo( startedProperty, 'change:value', this._onStartedChanged );
            }
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
        },

        _onStartedChanged: function( model, value ) {
            if ( value == 'true' ) {
                this.scenicChannel.vent.trigger('info', $.t( 'Quiddity __name__ was started', {name: this.model.get( 'name' )} ) );
            } else {
                this.scenicChannel.vent.trigger('info', $.t( 'Quiddity __name__ was stopped', {name: this.model.get( 'name' )} ) );
            }
        }
    } );

    return Source;
} );
