"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/table/source/shmdata/connection.html'
], function ( _, Backbone, Marionette, ConnectionTemplate ) {

    /**
     * Connection View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var Source = Marionette.ItemView.extend( {
        template: _.template( ConnectionTemplate ),
        className: 'connection',

        /**
         * Initialize
         */
        initialize: function( ) {

        }
    } );

    return Source;
} );
