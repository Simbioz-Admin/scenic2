"use strict";

define( [
    'underscore',
    'backbone',
    'model/sip/Contact'
], function ( _, Backbone, Contact ) {

    /**
     * SIP Destinations
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var SIPDestinations = Backbone.Collection.extend( {
        model: Contact,

        /**
         * Initialization
         *
         * @param models
         * @param options
         */
        initialize: function ( models, options ) {

        }
    } );

    return SIPDestinations;
} );
