"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/pages/settings.html'
], function ( _, Backbone, Marionette, SettingsTemplate ) {

    /**
     *  @constructor
     *  @augments PageView
     */
    var Settings = Marionette.ItemView.extend( {
        tagName: 'div',
        className: 'settings',
        template: _.template(SettingsTemplate),

        templateHelpers: function() {
            return {
                config: app.config
            }
        },

        /**
         * Initialize
         */
        initialize: function( ) {

        }
    } );

    return Settings;
} );
