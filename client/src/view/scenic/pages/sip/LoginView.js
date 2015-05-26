"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/pages/sip/login.html'
], function ( _, Backbone, Marionette, LoginTemplate ) {

    /**
     * SIP Login View
     *
     * @constructor
     * @extends module:Marionette.ItemVIew
     */
    var LoginView = Marionette.ItemView.extend( {
        template:  _.template( LoginTemplate ),
        className: 'login',

        ui: {
            server:   '#sipServer',
            user:     '#sipUsername',
            password: '#sipPassword',
            port:     '#sipPort',
            login:    '#sipLogin'
        },

        events: {
            'click @ui.login': 'login'
        },

        templateHelpers: function () {
            return {
                sip: this.model.sip.toJSON(),
                error: this.options.error
            };
        },

        /**
         * Initialize
         */
        initialize: function () {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
        },

        /**
         * Login
         */
        login: function () {
            // TODO: Validation
            this.model.sip.login( this.ui.server.val(), this.ui.port.val(), this.ui.user.val(), this.ui.password.val() );
        }
    } );

    return LoginView;
} )
;
