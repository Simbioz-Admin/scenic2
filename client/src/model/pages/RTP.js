"use strict";

define( [
    'jquery',
    'underscore',
    'backbone',
    'lib/socket',
    'model/pages/base/Table'
], function ( $, _, Backbone, socket, Table ) {

    /**
     * RTP Table
     *
     * @constructor
     * @extends Table
     */

    var RTP = Table.extend( {

        defaults: function () {
            return {
                id:          "rtp",
                name:        $.t( 'Transfer' ),
                type:        "transfer",
                description: $.t( "Manage connexions with host destination" ),
                source:      {
                    include: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"]
                }
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            Table.prototype.initialize.apply( this, arguments );
        }
    } );

    return RTP;
} );