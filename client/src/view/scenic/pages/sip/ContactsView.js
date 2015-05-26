"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/sip/ContactView',
    'text!template/scenic/pages/sip/contacts.html'
], function ( _, Backbone, Marionette, ContactView, ContactsTemplate ) {

    /**
     * Contacts View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var ContactsView = Marionette.CompositeView.extend( {
        template: _.template( ContactsTemplate ),
        className: 'contacts',

        childView: ContactView,
        childViewOptions: function() {
            return {
                table: this.options.table
            }
        },
        childViewContainer: '.contact-list',
        
        ui: {
            addContact: '#sipAddContactInput'
        },
        
        events: {
            'keypress @ui.addContact': '_onAddContactKeypress'
        },

        /**
         * Initialize
         */
        initialize: function( ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
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

    return ContactsView;
} );
