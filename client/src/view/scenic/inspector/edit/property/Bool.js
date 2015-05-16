"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/inspector/edit/property/bool.html'
], function ( _, Backbone, Marionette, BoolTemplate ) {

    /**
     * Bool View
     *
     * @constructor
     * @extends module:Marionette.LayoutView
     */
    var BoolProperty = Marionette.ItemView.extend( {
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
            this.model.set( 'value', this.ui.property.val() );
        }
    } );

    return BoolProperty;
} );
