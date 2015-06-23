"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'view/scenic/pages/base/table/source/ShmdataView',
    'text!template/scenic/pages/control/source.html'
], function ( _, Backbone, Marionette, i18n, ShmdataView, ControlSourceTemplate ) {

    /**
     * Control Source View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var ControlSourceView = Marionette.CompositeView.extend( {
        template:           _.template( ControlSourceTemplate ),
        templateHelpers:    function () {
            return {
                classDescription: this.model.get( 'classDescription' ).toJSON()
            }
        },
        className:          'quiddity source',
        childView:          ShmdataView,
        childViewOptions:   function () {
            return {
                table:          this.table,
                collection:     this.table.getDestinationCollection(),
                connectionView: this.options.connectionView
            }
        },
        childViewContainer: '.source-properties',

        ui: {
            edit:   '.actions .action.edit',
            remove: '.actions .action.remove'
        },

        events: {
            'click @ui.edit':   'editSource',
            'click @ui.remove': 'removeSource'
        },

        /**
         * Initialize
         */
        initialize: function (options) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.table         = options.table;
            this.collection    = this.model.get( 'properties' );
        },

        /**
         * Filter properties per table
         *
         * @param {Property} property
         * @returns {boolean}
         */
        filter: function ( property ) {
            return _.contains( this.table.allowedPropertyTypes, property.get( 'type' ) );
        },

        /**
         * Edit Handler
         * @param event
         */
        editSource: function ( event ) {
            this.model.edit();
        },

        /**
         * Remove Handler
         * @param event
         */
        removeSource: function ( event ) {
            var self = this;
            this.scenicChannel.commands.execute( 'confirm', i18n.t( 'Are you sure you want to remove the __sourceName__ source?', { sourceName: this.model.id } ), function ( confirmed ) {
                if ( confirmed ) {
                    self.model.destroy();
                }
            } );
        }
    } );

    return ControlSourceView;
} );
