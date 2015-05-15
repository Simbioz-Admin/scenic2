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
    var ControlDestination = Destination.extend( {
        defaults:    {

        },

        initialize: function () {
            Destination.prototype.initialize.apply(this,arguments);
        }
    } );

    return ControlDestination;
} );
