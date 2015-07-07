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
    var SettingsTableView = Marionette.ItemView.extend( {
        tagName: 'div',
        className: 'settings',
        template: _.template(SettingsTemplate),

        /**
         * Initialize
         */
        initialize: function( ) {

        }
    } );

    return SettingsTableView;
} );
