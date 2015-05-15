"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/Destination'
], function ( _, Backbone, Destination ) {

    /**
     *  @constructor
     *  @extends Destination
     */
    var RTPDestination = Destination.extend( {
        defaults:    {

        },

        initialize: function () {
            Destination.prototype.initialize.apply(this,arguments);
        }
    } );

    return RTPDestination;
} );
