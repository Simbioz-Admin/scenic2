"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicModel'
], function ( _, Backbone, ScenicModel ) {

    /**
     * Base Destination
     *
     * @constructor
     * @extends ScenicModel
     */
    var Destination = ScenicModel.extend( {
        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);
        }
    } );

    return Destination;
} );
