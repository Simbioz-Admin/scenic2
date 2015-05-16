"use strict";

define( [
    'underscore',
    'backbone'
], function ( _, Backbone ) {

    /**
     * Method Argument
     *
     * @constructor
     * @extends module:Backbone.Model
     */
    var Argument = Backbone.Model.extend( {

        defaults: {
            'name': null,
            'long name': null,
            'description': null,
            'type': null
        },

        /**
         * Initialize
         */
        initialize: function () {

        }
    } );

    return Argument;
} );
