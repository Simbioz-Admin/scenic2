"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/pages/base/Page'
], function ( _, Backbone, socket, Page ) {

    /**
     * Settings Page
     *
     * @constructor
     * @extends Page
     */

    var Settings = Page.extend( {

        defaults: function () {
            return {
                id:          "settings",
                name:        $.t( 'Settings' ),
                type:        'settings',
                description: $.t( "Manage Scenic settings" )
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            Page.prototype.initialize.apply( this, arguments );

        }
    } );

    return Settings;
} );