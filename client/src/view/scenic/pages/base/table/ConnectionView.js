"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/pages/base/table/connection.html'
], function ( _, Backbone, Marionette, ConnectionTemplate ) {

    /**
     * Connection View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var ConnectionView = Marionette.ItemView.extend( {
        template:  _.template( ConnectionTemplate ),
        className: 'connection',

        ui: {
            connect: '.action.connect'
        },

        events: {
            'click @ui.connect': 'toggleConnection'
        },

        /**
         * Initialize
         */
        initialize: function ( options ) {
            var self = this;

            // Keep options internally
            this.scenic      = options.scenic;
            this.table       = options.table;
            this.source      = options.source;
            this.destination = options.model;

            // Check if we can connect, this only need to happen once
            this.options.table.canConnect( this.source, this.destination, function ( canConnect ) {
                self.canConnect = canConnect;
                self.$el.removeClass( 'enabled disabled' ).addClass( self.canConnect ? 'enabled' : 'disabled' );
            } );
        },

        onRender: function () {
            // Check if we are connected
            this.$el.removeClass( 'active inactive' ).addClass( this.table.isConnected( this.source, this.destination ) ? 'active' : 'inactive' );
        },

        toggleConnection: function () {
            if ( !this.canConnect ) {
                return;
            }
            if ( this.table.isConnected( this.source, this.destination ) ) {
                this.table.disconnect( this.source, this.destination );
            } else {
                this.table.connect( this.source, this.destination );
            }
        }
    } );

    return ConnectionView;
} );
