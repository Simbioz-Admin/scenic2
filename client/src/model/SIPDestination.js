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
    var SIPDestination = Destination.extend( {
        defaults:    {

        },

        initialize: function () {
            Destination.prototype.initialize.apply(this,arguments);
        }
    } );

    return SIPDestination;
} );
