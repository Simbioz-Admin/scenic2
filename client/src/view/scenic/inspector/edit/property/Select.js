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

        ui: {
            property: '.property'
        },

        events: {
            'change .property': 'updateModel'
        },

        /**
         * Initialize
         */
        initialize: function( ) {
            FieldView.prototype.initialize( this, arguments );
        },

        /**
         * Update
         *
         * @param event
         */
        updateModel: function ( event ) {
            // Update the model
            this.model.set('value', this.ui.property.val() );
        },

        /**
         * Set the value of the slider
         * @inheritdoc
         */
        onModelChanged: function( model, value, options ) {
            this.ui.property.val( value );
        }
    } );

    return SelectProperty;
} );
