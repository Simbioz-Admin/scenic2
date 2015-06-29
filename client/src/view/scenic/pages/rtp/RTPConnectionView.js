"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/ConnectionView',
    'text!template/scenic/pages/rtp/connection.html'
], function ( _, Backbone, Marionette, ConnectionView, RTPConnectionTemplate ) {

    /**
     * Connection View
     *
     * @constructor
     * @extends ConnectionView
     */
    var RTPConnectionView = ConnectionView.extend( {
        template:  _.template( RTPConnectionTemplate ),

        ui: _.extend({}, ConnectionView.prototype.ui, {
            port: '.portInput'
        }),

        events:  _.extend({}, ConnectionView.prototype.events, {
            'keypress @ui.port': 'validateCharacter',
            'keydown @ui.port':  'portKeyAction',
            'blur @ui.port':     'cancel'
        }),

        templateHelpers: function () {
            return {
                port:      this.port,
                portEntry: this.portEntry
            }
        },

        port:      null,
        portEntry: false,

        /**
         * Initialize
         */
        initialize: function ( options ) {
            ConnectionView.prototype.initialize.apply( this, arguments );

            this.listenTo( this.destination, 'change:data_streams', this.render );
        },

        onBeforeRender: function () {
            var connection = this.table.getConnection( this.source, this.destination );
            this.port      = connection ? connection.port : null;
        },

        onRender: function () {
            ConnectionView.prototype.onRender.apply( this, arguments );
            if ( this.ui.port ) {
                _.defer( _.bind( this.ui.port.focus, this.ui.port ) );
            }
        },

        toggleConnection: function ( event ) {
            event.preventDefault();
            if ( !this.canConnect || this.portEntry ) {
                return;
            }

            if ( this.table.isConnected( this.source, this.destination ) ) {
                this.portEntry = false;
                this.table.disconnect( this.source, this.destination );
            } else {
                this.portEntry = true;
                this.render();
            }
        },

        validateCharacter: function ( event ) {
            var key = event.which || event.keyCode;
            if ( isNaN( parseInt( String.fromCharCode( key ) ) ) ) {
                event.preventDefault();
            }
        },

        portKeyAction: function ( event ) {
            var key = event.which || event.keyCode;
            if ( key == 13 ) {
                // ENTER Key, connect
                var self = this;
                this.table.connect( this.source, this.destination, this.ui.port.val(), function ( error ) {
                    if ( !error ) {
                        self.cancel();
                    }
                } );
            } else if ( key == 27 ) {
                // ESC Key, cancel
                this.cancel();
            }
        },

        cancel: function () {
            this.port      = null;
            this.portEntry = false;
            this.render();
        }
    } );

    return RTPConnectionView;
} );
