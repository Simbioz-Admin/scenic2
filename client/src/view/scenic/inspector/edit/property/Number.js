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

        /**
         * Initialize
         */
        initialize: function( ) {
            FieldView.prototype.initialize( this, arguments );

            //TODO: Put in model
            this.model.set('default property', parseFloat( this.model.get("default value").replace(",", ".") ) )
        },

        onRender: function() {
            var self = this;
            var type = this.model.get('type');
            var minimum = this.model.get('minimum');
            var maximum = this.model.get('maximum');
            var step = (type == "int" || type == "uint" ? 1 : (parseInt(maximum) - parseInt(minimum)) / 200);
            this.$el.slider({
                range: "min",
                value: self.model.get("default value"),
                step: step,
                min: type == "int" || type == "uint" ? parseInt(minimum) : parseFloat(minimum),
                max: type == "int" || type == "uint" ? parseInt(maximum) : parseFloat(maximum),
                slide: function(event, ui) {
                    self.model.set('value', ui.value);
                }
            });
        }
    } );

    return NumberProperty;
} );
