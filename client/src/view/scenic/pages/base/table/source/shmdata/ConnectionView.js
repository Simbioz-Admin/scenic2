"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/pages/base/table/source/shmdata/connection.html'
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

        events: {
            'click': 'toggleConnection'
        },

        /**
         * Initialize
         */
        initialize: function ( options ) {
            var self = this;

            // Keep options internally
            this.shmdata     = options.shmdata;
            this.destination = options.model;
            this.table       = options.table;

            // Re-render when destination shmdatas change, it might mean we connected/disconnected
            this.listenTo( this.destination.get( 'shmdatas' ), 'update', this.render );

            // Check if we can connect, this only need to happen once
            this.options.table.canConnect( this.shmdata, this.destination, function ( canConnect ) {
                self.canConnect = canConnect;
                self.$el.removeClass( 'enabled disabled' ).addClass( self.canConnect ? 'enabled' : 'disabled' );
            } );
        },

        onRender: function () {
            // Check if we are connected
            this.$el.removeClass( 'active inactive' ).addClass( this.table.isConnected( this.shmdata, this.destination ) ? 'active' : 'inactive' );
        },

        toggleConnection: function () {
            if ( !this.canConnect ) {
                return;
            }
            if ( this.table.isConnected( this.shmdata, this.destination ) ) {
                this.table.disconnect( this.shmdata, this.destination );
            } else {
                this.table.connect( this.shmdata, this.destination );
            }
        }
    } );

    return ConnectionView;
} );
