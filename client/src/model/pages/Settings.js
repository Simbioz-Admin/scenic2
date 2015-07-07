"use strict";

define( [
    'underscore',
    'backbone',
    'i18n',
    'model/Page'
], function ( _, Backbone, i18n, Page ) {

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
                name:        i18n.t( 'Settings' ),
                type:        'settings',
                description: i18n.t( "Manage Scenic settings" )
            }
        },

        mutators: {
            config: {
                transient: true,
                get: function() {
                    return this.scenic.config;
                }
            },
            sip: {
                transient: true,
                get: function() {
                    return this.scenic.quiddities.get(this.scenic.config.sip.quiddName);
                }
            }
        },

        /**
         * Initialize
         */
        initialize: function (attributes, options) {
            Page.prototype.initialize.apply( this, arguments );
        }
    } );

    return Settings;
} );