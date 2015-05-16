"use strict";

define( [
    'underscore',
    'backbone',
    'marionette'
    //'text!template/scenic/table/menu.html'
], function ( _, Backbone, Marionette ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Marionette.CollectionView
     */
    var Destinations = Backbone.Marionette.CollectionView.extend( {
        initialize: function( ) {
        }
    } );
    return Destinations;
} );
