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
            'change .property': 'update'
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
        update: function ( event ) {
            if ( this.ui.property.is( ':checked' ) ) {
                this.ui.property.val( 'true' ).attr( 'checked', true );
            } else {
                this.ui.property.val( 'false' ).attr( 'checked', false );
            }
            this.model.setValue( this.ui.property.val() );
        }
    } );

    return BoolProperty;
} );
