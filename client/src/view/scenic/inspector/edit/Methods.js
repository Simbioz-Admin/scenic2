"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/inspector/edit/Method'
], function ( _, Backbone, Marionette, MethodView ) {

    /**
     * Methods Collection View
     *
     * @constructor
     * @extends module:Marionette.CollectionView
     */
    var Methods = Marionette.CollectionView.extend( {
        childView: MethodView,
        tagName: 'ul',

        excludedMethods: ['connect', 'disconnect', 'disconnect-all', 'can-sink-caps'],

        /**
         * Initialize
         */
        initialize: function( ) {

        },

        /**
         * Method Filter
         *
         * @param {Method} method
         * @returns {boolean}
         */
        filter: function (method) {

            return !_.contains( this.excludedMethods, method.id );
        }
    } );

    return Methods;
} );
