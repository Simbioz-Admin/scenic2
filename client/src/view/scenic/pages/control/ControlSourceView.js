"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'view/scenic/pages/base/table/SourceView'
], function ( _, Backbone, Marionette, i18n, SourceView ) {

    /**
     * Control Source View
     *
     * @constructor
     * @extends SourceView
     */
    var ControlSourceView = SourceView.extend( {

        /**
         * Initialize
         */
        initialize: function (options) {
            SourceView.prototype.initialize.apply(this, arguments);
            this.collection    = this.model.properties;
        },

        /**
         * Filter properties per table
         *
         * @param {Property} property
         * @returns {boolean}
         */
        filter: function ( property ) {
            return _.contains( this.table.allowedPropertyTypes, property.get( 'type' ) );
        }
    } );

    return ControlSourceView;
} );
