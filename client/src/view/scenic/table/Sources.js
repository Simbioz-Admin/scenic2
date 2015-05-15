"use strict";

define( [
    'underscore',
    'backbone',
    'marionette'
    //'text!../../../../template/table/menu.html'
], function ( _, Backbone, Marionette ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Marionette.CollectionView
     */
    var Sources = Backbone.Marionette.CollectionView.extend( {
        initialize: function( ) {
        }
    } );
    return Sources;
} );
