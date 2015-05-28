"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/pages/sip/contact.html'
], function ( _, Backbone, Marionette, ContactTemplate ) {

    /**
     * Contact View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var ContactView = Marionette.ItemView.extend( {
        template:  _.template( ContactTemplate ),
        className: 'contact',

        ui: {
            add: '.add-destination',
            edit: '.edit-contact'
        },

        events: {
            'click @ui.add': 'addContactAsDestination'
        },

        attributes: function () {
            return {
                class: ['contact', this.model.get( 'status' ).toLowerCase(), this.model.get( 'subscription_state' ).toLowerCase()].join( ' ' )
            }
        },

        modelEvents: {
            'change:status': 'render'
        },

        /**
         * Initialize
         */
        initialize: function ( options ) {
            // Keep options internally
            this.table = options.table;
        },

        onRender: function () {
            // Update Dynamic Attributes
            this.$el.attr( this.attributes() );
        },

        addContactAsDestination: function() {
            this.table.addDestination( this.model );
        }
    } );

    return ContactView;
} );
