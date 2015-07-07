"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/pages/sip/control.html'
], function ( _, Backbone, Marionette, ControlTemplate ) {

    /**
     * SIP Control View
     *
     * @constructor
     * @extends module:Marionette.ItemVIew
     */
    var ControlView = Marionette.ItemView.extend( {
        template: _.template( ControlTemplate ),
        className: 'control',

        ui: {
            logout: '#sipLogout',
            addContact: '#sipAddContactInput'
        },

        events: {
            'click @ui.logout': 'logout',
            'keypress @ui.addContact': '_onAddContactKeypress'
        },

        /**
         * Initialize
         */
        initialize: function () {

        },

        /**
         * Logout
         */
        logout: function() {
            this.model.logout();
        },

        /**
         * AddContactInput Keypress Handler
         *
         * @param event
         * @private
         */
        _onAddContactKeypress: function( event ) {
            var key = event.which || event.keyCode;
            if ( key == 13 ) {
                this.model.addContact( this.ui.addContact.val() );
            }
        }
    } );

    return ControlView;
} )
;
