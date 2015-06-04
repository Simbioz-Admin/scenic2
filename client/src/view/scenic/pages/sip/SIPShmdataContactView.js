"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/source/ShmdataView',
    'text!template/scenic/pages/sip/source-contact.html'
], function ( _, Backbone, Marionette, ShmdataView, SIPSourceContactTemplate ) {

    /**
     * SIP Shmdata Contact View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var SIPShmdataContactView = Marionette.CompositeView.extend( {
        template:           _.template( SIPSourceContactTemplate ),
        className:          'contact',
        childView:          ShmdataView,
        childViewOptions:   function () {
            return {
                table:          this.options.table,
                collection:     this.options.table.getDestinationCollection(),
                connectionView: this.options.connectionView
            }
        },
        childViewContainer: '.shmdatas',

        attributes: function () {
            return {
                class: ['contact', this.model.get( 'status' ).toLowerCase(), this.model.get( 'subscription_state' ).toLowerCase()].join( ' ' )
            }
        },

        modelEvents: {
            'change': 'render'
        },

        /**
         * Initialize
         */
        initialize: function ( options ) {

        },

        onRender: function () {
            // Update Dynamic Attributes
            this.$el.attr( this.attributes() );
        },

        /**
         * Only show shmdata for this sip contact
         *
         * @param shmdata
         * @param index
         * @param collection
         * @returns {boolean}
         */
        filter: function ( shmdata, index, collection ) {
            return this.model.get( 'uri' ) == shmdata.get( 'uri' );
        }
    } );

    return SIPShmdataContactView;
} );
