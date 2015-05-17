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
            'change:default value': 'updateValue' //TODO Just render for now, update more precisely in the future
        },

        /**
         * Set value on the model with the internal flag set so that we don't re-render aimlessly
         * @param value
         */
        updateValue: function( model, value, options ) {
            console.log( options );
        }
    } );

    return Field;
} );
