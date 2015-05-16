"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/inspector/edit/property/string.html'
], function ( _, Backbone, Marionette, StringTemplate ) {

    /**
     * String View
     *
     * @constructor
     * @extends module:Marionette.LayoutView
     */
    var StringProperty = Marionette.ItemView.extend( {
        template: _.template( StringTemplate ),

        ui: {
            property: '.property',
            update:   '.update'
        },

        events: {
            'click @ui.update': 'update'
        },

        /**
         * Initialize
         */
        initialize: function () {

        },

        /**
         * Update
         *
         * @param event
         */
        update: function ( event ) {
            this.model.set( 'value', this.ui.property.val() );
        }
    } );

    return StringProperty;
} );
