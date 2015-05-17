"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/inspector/edit/property/Field',
    'text!template/scenic/inspector/edit/property/select.html'
], function ( _, Backbone, Marionette, FieldView, SelectTemplate ) {

    /**
     * Select View
     *
     * @constructor
     * @extends FieldView
     */
    var SelectProperty = FieldView.extend( {
        template: _.template( SelectTemplate ),

        /**
         * Initialize
         */
        initialize: function( ) {
            FieldView.prototype.initialize( this, arguments );
        }
    } );

    return SelectProperty;
} );
