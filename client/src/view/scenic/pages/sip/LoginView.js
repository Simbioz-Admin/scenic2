"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'lib/spin',
    'text!template/scenic/pages/sip/login.html',
    'text!template/scenic/pages/sip/connecting.html'
], function ( _, Backbone, Marionette, spin, LoginTemplate, ConnectingTemplate ) {

    /**
     * SIP Login View
     *
     * @constructor
     * @extends module:Marionette.ItemVIew
     */
    var LoginView = Marionette.ItemView.extend( {
        className: 'login',

        ui: {
            server:   '#sipServer',
            user:     '#sipUsername',
            password: '#sipPassword',
            port:     '#sipPort',
            login:    '#sipLogin'
        },

        events: {
            'click @ui.login': 'login',
            'keypress @ui.server': 'checkForEnterKey',
            'keypress @ui.user': 'checkForEnterKey',
            'keypress @ui.password': 'checkForEnterKey',
            'keypress @ui.port': 'checkForEnterKey'
        },

        getTemplate: function() {
            if ( this.model.get('connecting')) {
                return _.template(ConnectingTemplate);
            } else {
                return _.template(LoginTemplate);
            }
        },

        templateHelpers: function () {
            return {
                error: this.error
            };
        },

        /**
         * Initialize
         */
        initialize: function () {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
        },

        onRender: function() {
            $('*', this.$el).prop('disabled', false);
            this.$el.fadeTo( 250, 1.0 );
        },

        checkForEnterKey: function( event ) {
            var key = event.which || event.keyCode;
            if ( key == 13 ) {
                event.preventDefault();
                this.login();
            }
        },

        /**
         * Login
         */
        login: function () {
            var self = this;
            $('*', this.$el).prop('disabled', true);
            this.$el.fadeTo( 250, 0.5, function() {
                if ( !self.isDestroyed ) {
                    self.render();
                }
            } );

            // TODO: Validation
            this.model.login( this.ui.server.val(), this.ui.port.val(), this.ui.user.val(), this.ui.password.val(), function( error ) {
                if ( error ) {
                    self.error = error;
                    self.render();
                }
            } );
        }
    } );

    return LoginView;
} )
;
