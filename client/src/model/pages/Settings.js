"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'i18n',
    'app',
    'model/Page'
], function ( _, Backbone, socket, i18n, app, Page ) {

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
                    return app.config;
                }
            },
            sip: {
                transient: true,
                get: function() {
                    return app.quiddities.get(app.config.sip.quiddName);
                }
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