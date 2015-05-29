"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/sip/ContactView'
], function ( _, Backbone, Marionette, ContactView ) {

    /**
     * Contacts View
     *
     * @constructor
     * @extends module:Marionette.CollectionVIew
     */
    var ContactsView = Marionette.CollectionView.extend( {
        className: 'contact-list',
        childView: ContactView,
        childViewOptions: function() {
            return {
                table: this.options.table
            }
        },

        /**
         * Initialize
         */
        initialize: function( ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
        },

        /**
         * Contacts View Filter
         *
         * @param contact
         * @returns {boolean}
         */
        filter: function (contact) {
            return !contact.get('self');
        }
    } );

    return ContactsView;
} );
