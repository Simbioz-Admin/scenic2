"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/Destination'
], function ( _, Backbone, Destination ) {

    /**
     * SIP Destination
     *
     * @constructor
     * @extends Destination
     */
    var SIPDestination = Destination.extend( {

        /**
         * Initialize
         */
        initialize: function () {
            Destination.prototype.initialize.apply(this,arguments);
        }
    } );

    return SIPDestination;
} );
