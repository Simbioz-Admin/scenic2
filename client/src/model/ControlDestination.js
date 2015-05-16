"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/Destination'
], function ( _, Backbone, Destination ) {

    /**
     * Control Destination
     *
     * @constructor
     * @extends Destination
     */
    var ControlDestination = Destination.extend( {

        /**
         * Initialize
         */
        initialize: function () {
            Destination.prototype.initialize.apply(this,arguments);
        }
    } );

    return ControlDestination;
} );
