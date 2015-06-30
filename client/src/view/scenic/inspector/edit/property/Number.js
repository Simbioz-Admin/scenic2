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
            slider:   '.slider'
        },

        events: {
            'change .property': 'updateModel'
        },

        /**
         * Initialize
         */
        initialize: function () {
            FieldView.prototype.initialize( this, arguments );
        },

        onRender: function () {
            var self    = this;
            var type    = this.model.get( 'type' );
            var minimum = this.model.get( 'minimum' );
            var maximum = this.model.get( 'maximum' );
            var step    = type.indexOf('int') != -1 ? 1 : (maximum - minimum ) / 200;
            this.ui.slider.slider( {
                disabled: !this.model.get('writable'),
                range: "min",
                value: self.model.get( "value" ),
                step:  step,
                min:   minimum,
                max:   maximum,
                animate: false,
                slide: function ( event, ui ) {
                    self.model.updateValue( ui.value );
                }
            } );
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
        onModelValueChanged: function ( model, value, options ) {
            this.ui.property.val( value );
            this.ui.slider.slider( 'value', value );
        }
    } );

    return NumberProperty;
} );
