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
    var SinkConnectionView = ConnectionView.extend( {

        /**
         * Initialize
         */
        initialize: function ( options ) {
            ConnectionView.prototype.initialize.apply( this, arguments );

            // Re-render when destination shmdatas change, it might mean we connected/disconnected
            this.listenTo( this.destination.shmdatas, 'update', this.render );
        }
    } );

    return SinkConnectionView;
} );
