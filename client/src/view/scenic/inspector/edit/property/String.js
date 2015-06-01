"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/inspector/edit/property/Field',
    'text!template/scenic/inspector/edit/property/string.html'
], function ( _, Backbone, Marionette, FieldView, StringTemplate ) {

    /**
     * String View
     *
     * @constructor
     * @extends FieldView
     */
    var StringProperty = FieldView.extend( {
        template: _.template( StringTemplate ),

        ui: {
            property: '.property',
            update:   '.update'
        },

        events: {
            'click @ui.update': 'updateModel'
        },

        /**
         * Initialize
         */
        initialize: function () {
            FieldView.prototype.initialize( this, arguments );
        },

        /**
         * Update
         *
         * @param event
         */
        updateModel: function ( event ) {
            this.model.updateValue( this.ui.property.val() );
        },

        /**
         * Set the value of the slider
         * @inheritdoc
         */
        onModelValueChanged: function( model, value, options ) {
            this.ui.property.val( value );
        }
    } );

    return StringProperty;
} );
