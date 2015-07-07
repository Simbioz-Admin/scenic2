"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/ConnectionView'
], function ( _, Backbone, Marionette, ConnectionView ) {

    /**
     * Connection View
     *
     * @constructor
     * @extends ConnectionView
     */
    var SIPConnectionView = ConnectionView.extend( {

        /**
         * Initialize
         */
        initialize: function ( options ) {
            ConnectionView.prototype.initialize.apply( this, arguments );
            this.listenTo( this.model, 'change:connections', this.render );
        }
    } );

    return SIPConnectionView;
} );
