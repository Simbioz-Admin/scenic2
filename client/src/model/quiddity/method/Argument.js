"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/BaseModel'
], function ( _, Backbone, BaseModel ) {

    /**
     * Method Argument
     *
     * @constructor
     * @extends BaseModel
     */
    var Argument = BaseModel.extend( {

        defaults: {
            'name': null,
            'description': null,
            'type': null,
            // Dynamic
            'value': null
        },

        /**
         * Initialize
         */
        initialize: function () {

        }
    } );

    return Argument;
} );
