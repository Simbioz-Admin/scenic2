"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/inspector/edit/property/Field',
    'text!template/scenic/inspector/edit/property/number.html'
], function ( _, Backbone, Marionette, FieldView, NumberTemplate ) {

    /**
     * Number View
     *
     * @constructor
     * @extends FieldView
     */
    var NumberProperty = FieldView.extend( {
        template: _.template( NumberTemplate ),

        ui: {
            property: '.property',
            slider: '.slider'
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

        onRender: function() {
            var self = this;
            var type = this.model.get('type');
            var minimum = this.model.get('minimum');
            var maximum = this.model.get('maximum');
            var step = (type == "int" || type == "uint" ? 1 : (parseInt(maximum) - parseInt(minimum)) / 200);
            this.ui.slider.slider({
                range: "min",
                value: self.model.get("default value"),
                step: step,
                min: type == "int" || type == "uint" ? parseInt(minimum) : parseFloat(minimum),
                max: type == "int" || type == "uint" ? parseInt(maximum) : parseFloat(maximum),
                slide: function(event, ui) {
                    self.model.set('value', ui.value);
                }
            });
        },

        /**
         * Update
         *
         * @param event
         */
        updateModel: function ( event ) {
            this.model.set('value', this.ui.property.val() );
        },

        /**
         * Set the value of the slider
         * @inheritdoc
         */
        onModelChanged: function( model, value, options ) {
            this.ui.property.val( value );
            this.ui.slider.slider('value', value );
        }
    } );

    return NumberProperty;
} );
