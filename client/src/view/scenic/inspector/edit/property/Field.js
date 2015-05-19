"use strict";

define( [
    'underscore',
    'backbone',
    'marionette'
], function ( _, Backbone, Marionette ) {

    /**
     * Field
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var Field = Marionette.ItemView.extend( {

        modelEvents: {
            'change:value': 'onModelValueChanged'
        },

        initialize:function() {

        },

        /**
         * Value Changed Handler
         * Only redraws the view if the change isn't internal,
         * when the change is internal it's because it came from the ui
         * so we already have the right value shown, we don't need re-rendering
         *
         * Can be overridden to change the behavior to a type-optimized version
         */
        onModelValueChanged: function( model, value, options ) {
            if ( !options.internal ) {
                this.render();
            }
        }
    } );

    return Field;
} );
