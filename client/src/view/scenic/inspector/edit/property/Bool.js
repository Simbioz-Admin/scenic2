"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/inspector/edit/property/Field',
    'text!template/scenic/inspector/edit/property/bool.html'
], function ( _, Backbone, Marionette, FieldView, BoolTemplate ) {

    /**
     * Bool View
     *
     * @constructor
     * @extends FieldView
     */
    var BoolProperty = FieldView.extend( {
        template: _.template( BoolTemplate ),

        ui : {
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
         * Update Model Value
         *
         * @param event
         */
        updateModel: function ( event ) {
            // We have a custom checkbox, this is needed to toggle and set the actual value
            var checked = this.ui.property.is( ':checked' );
            this.ui.property.val( checked ).attr( 'checked', checked );
            // Update the model
            this.model.updateValue( this.ui.property.val() == 'true' );
        },

        /**
         * Set the value of the checkbox
         * @inheritdoc
         */
        onModelValueChanged: function( model, value, options ) {
            this.ui.property.val( value ).attr( 'checked', value );
        }
    } );

    return BoolProperty;
} );
