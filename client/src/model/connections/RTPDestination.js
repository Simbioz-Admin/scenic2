"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/Destination'
], function ( _, Backbone, Destination ) {

    /**
     * RTP Destination
     *
     * @constructor
     * @extends Destination
     */
    var RTPDestination = Destination.extend( {

        /**
         * Initialize
         */
        initialize: function () {
            Destination.prototype.initialize.apply(this,arguments);
        }
    } );

    return RTPDestination;
} );
