"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/inspector/edit/property/Number',
    'view/scenic/inspector/edit/property/Bool',
    'view/scenic/inspector/edit/property/String',
    'view/scenic/inspector/edit/property/Select',
    'text!template/scenic/inspector/edit/property.html'
], function ( _, Backbone, Marionette, NumberView, BoolView, StringView, SelectView, PropertyTemplate ) {

    /**
     * Property View
     *
     * @constructor
     * @extends module:Marionette.LayoutView
     */
    var Property = Marionette.LayoutView.extend( {
        template:  _.template( PropertyTemplate ),
        tagName:   'li',
        className: 'property-form',

        regions: {
            field: '.field'
        },

        modelEvents: {
            'change': 'renderOnChange'
        },

        /**
         * Initialize
         */
        initialize: function () {

        },

        renderOnChange: function() {
            // Ignore if only the value has changed, let the field view handle this
            if ( _.keys(this.model.changedAttributes()).length == 1 && this.model.hasChanged('value') ) {
                return;
            }
            this.render();
        },

        /**
         * On Show Handler
         */
        onRender: function () {
            if ( !this.model.get('writable') ) {
                this.$el.addClass( 'readonly' );
            }
            this.showFieldView();
        },

        /**
         * Shows the view & template associated with the property type
         */
        showFieldView: function () {
            var view = null;
            switch ( this.model.get( 'type' ) ) {
                case 'float':
                case 'int':
                case 'int64':
                case 'double':
                case 'uint':
                    this.$el.addClass( 'number' );
                    view = new NumberView( {model: this.model} );
                    break;
                case 'boolean':
                    this.$el.addClass( 'bool' );
                    view = new BoolView( {model: this.model} );
                    break;
                case 'enum':
                    this.$el.addClass( 'select' );
                    view = new SelectView( {model: this.model} );
                    break;
                case 'string':
                default:
                    this.$el.addClass( 'string' );
                    view = new StringView( {model: this.model} );
                    break;
            }
            if ( view ) {
                this.showChildView( 'field', view );
            }
        }
    } );

    return Property;
} );
