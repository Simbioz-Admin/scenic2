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

        onAttach: function() {
            var self = this;
            this.ui.property.selectmenu( {
                disabled: !this.model.get('writable'),
                width: '100%',
                change: function ( event, ui ) {
                    self.model.updateValue( ui.item.value );
                }
            });
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
            this.ui.property.selectmenu('refresh');
        }
    } );

    return SelectProperty;
} );
