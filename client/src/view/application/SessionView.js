"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/application/session.html'
], function ( _, Backbone, Marionette, SessionTemplate ) {

    /**
     * Session View
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */

    var SessionView = Marionette.ItemView.extend( {

        template: _.template(SessionTemplate),

        events:    {
            'click': 'activate'
        },

        modelEvents: {
            "change:active": "render"
        },

        /**
         * Initialize
         */
        initialize: function (options) {

        },

        /**
         * Activate Handler
         * Activates the model assigned to this session
         */
        activate: function() {
            this.model.activate();
        }
    } );

    return SessionView;
} );
