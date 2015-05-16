"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/table/source/Shmdata'
], function ( _, Backbone, Marionette, ShmdataView ) {

    /**
     * Shmdata Collection View
     *
     * @constructor
     * @extends module:Marionette.CollectionView
     */
    var Shmdatas = Marionette.CollectionView.extend( {
        childView: ShmdataView,

        /**
         * Initialize
         */
        initialize: function( ) {
            console.log( this.childView );
        }
    } );

    return Shmdatas;
} );
