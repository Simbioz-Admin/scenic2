"use strict";

define( [
    'underscore',
    'backbone',
    'model/pages/rtp/RTPDestination'
], function ( _, Backbone, RTPDestination ) {

    /**
     * RTP Destinations
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var RTPDestinations = Backbone.Collection.extend( {
        model: RTPDestination,

        initialize: function( options ) {
            this.property = options.property;
            console.warn( this.property );
            this.listenTo( this.property, 'change', function( a,b,c ) {
                console.log( a,b,c );
            });
        }
    } );

    return RTPDestinations;
} );
