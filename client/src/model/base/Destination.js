"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicModel'
], function ( _, Backbone, ScenicModel ) {

    /**
     *  @constructor
     *  @extends ScenicModel
     */
    var Destination = ScenicModel.extend( {
        defaults:    {

        },

        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);
        }
    } );

    return Destination;
} );
