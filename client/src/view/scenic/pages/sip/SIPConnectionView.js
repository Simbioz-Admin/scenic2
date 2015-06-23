"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/source/shmdata/ConnectionView'
], function ( _, Backbone, Marionette, ConnectionView ) {

    /**
     * Connection View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var SIPConnectionView = ConnectionView.extend( {

        /**
         * Initialize
         */
        initialize: function ( options ) {
            ConnectionView.prototype.initialize.apply( this, arguments );
            this.listenTo( this.model, 'change:connection', this.render );
        }
    } );

    return SIPConnectionView;
} );
