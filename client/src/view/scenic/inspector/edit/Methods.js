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

        excludedMethods: ['connect', 'disconnect', 'disconnect-all', 'can-sink-caps'],

        /**
         * Initialize
         */
        initialize: function( ) {
            //TODO: Sort
        },

        /**
         * Method Filter
         *
         * @param {Method} method
         * @returns {boolean}
         */
        filter: function (method) {
            var excluded = _.contains( this.excludedMethods, method.get('name') );
            if ( excluded ) {
                console.log( 'Excluded: ', method );
            }
            return !excluded;
        }
    } );

    return Methods;
} );
