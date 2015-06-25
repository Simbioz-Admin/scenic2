"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/ConnectionView'
], function ( _, Backbone, Marionette, ConnectionView ) {

    /**
     * Control Connection View
     *
     * @constructor
     * @extends ConnectionView
     */
    var ControlConnectionView = ConnectionView.extend( {

        /**
         * Initialize
         */
        initialize: function ( options ) {
            ConnectionView.prototype.initialize.apply( this, arguments );
            this.listenTo(this.table.destinations,'update', this.render );
        }
    } );

    return ControlConnectionView;
} );
