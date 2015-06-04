"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/SourceView',
    'view/scenic/pages/sip/SIPShmdataContactView',
    'text!template/scenic/pages/sip/source.html'
], function ( _, Backbone, Marionette, SourceView, SIPShmdataContactView, SIPSourceTemplate ) {

    /**
     * SIP Source View
     *
     * @constructor
     * @extends SourceView
     */
    var SIPSourceView = SourceView.extend( {
        template:           _.template( SIPSourceTemplate ),
        childView:          SIPShmdataContactView,
        childViewOptions:   function () {
            return {
                table:          this.options.table,
                collection:     this.model.get( 'shmdatas' ),
                connectionView: this.options.connectionView
            }
        },
        childViewContainer: '.source-contacts',

        /**
         * Initialize
         */
        initialize: function () {
            SourceView.prototype.initialize.apply( this, arguments );
            this.collection = this.options.table.sip.get( 'contacts' );
            this.listenTo( this.model.get( 'shmdatas' ), 'update', this.render );
        },

        /**
         * Only show sip contacts with connections
         *
         * @param contact
         * @param index
         * @param collection
         * @returns {boolean}
         */
        filter: function ( contact, index, collection ) {
            return this.model.get( 'shmdatas' ).findWhere( {uri: contact.get( 'uri' )} ) != null;
        }
    } );

    return SIPSourceView;
} );
