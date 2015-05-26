"use strict";

define( [
    'jquery',
    'underscore',
    'backbone',
    'lib/socket',
    'model/pages/base/Table',
    'model/sip/Contact'
], function ( $, _, Backbone, socket, Table ) {

    /**
     * SIP Table
     *
     * @constructor
     * @extends Table
     */

    var SIP = Table.extend( {

        defaults: function () {
            return {
                id:          "sip",
                name:        $.t( "SIP" ),
                type:        "transfer",
                description: $.t( "Manage transfer of shmdatas to SIP contacts" ),
                source:      {
                    include: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"]
                }
            }
        },

        /**
         * Initialize
         */
        initialize: function ( options) {
            Table.prototype.initialize.apply( this, arguments );
            this.sip = options.sip;
        }
    } );

    return SIP;
} );