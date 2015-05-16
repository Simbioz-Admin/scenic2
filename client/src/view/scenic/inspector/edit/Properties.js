"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/inspector/edit/Property'
], function ( _, Backbone, Marionette, PropertyView ) {

    /**
     * Properties Collection View
     *
     * @constructor
     * @extends module:Marionette.CollectionView
     */
    var Properties = Marionette.CollectionView.extend( {
        childView: PropertyView,
        tagName: 'ul',

        excludedProperties: ['devices-json', 'shmdata-writers', 'shmdata-readers'],

        /**
         * Initialize
         */
        initialize: function( ) {
            //TODO: Sort
        },

        /**
         * Property Filter
         *
         * @param {Property} property
         * @returns {boolean}
         */
        filter: function (property) {
            var excluded = _.contains( this.excludedProperties, property.get('name') );
            if ( excluded ) {
                console.log( 'Excluded: ', property );
            }
            return !excluded;
        }
    } );

    return Properties;
} );
