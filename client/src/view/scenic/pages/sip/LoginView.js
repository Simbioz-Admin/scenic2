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
        template: _.template( LoginTemplate ),
        className: 'login',

        /**
         * Initialize
         */
        initialize: function( ) {

        }
    } );

    return LoginView;
} );
