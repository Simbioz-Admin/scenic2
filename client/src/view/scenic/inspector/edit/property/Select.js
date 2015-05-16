"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/inspector/edit/property/select.html'
], function ( _, Backbone, Marionette, SelectTemplate ) {

    /**
     * Select View
     *
     * @constructor
     * @extends module:Marionette.LayoutView
     */
    var SelectProperty = Marionette.ItemView.extend( {
        template: _.template( SelectTemplate ),

        /**
         * Initialize
         */
        initialize: function( ) {

        }
    } );

    return SelectProperty;
} );
