"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/table/Source'
], function ( _, Backbone, Marionette, SourceView ) {

    /**
     * Source Collection
     *
     * @constructor
     * @augments module:Marionette.CollectionView
     */
    var Sources = Marionette.CollectionView.extend( {
        childView: SourceView,

        /**
         * Initialize
         */
        initialize: function( ) {

        },

        /**
         * Sources View Filter
         *
         * @param quiddity
         * @returns {boolean}
         */
        filter: function (quiddity) {
            return this.model.filterQuiddityOrClass( 'source', quiddity );
        }
    } );

    return Sources;
} );
