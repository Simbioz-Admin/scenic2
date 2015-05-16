"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/table/source/shmdata/Connection',
    'text!template/scenic/table/source/shmdata.html'
], function ( _, Backbone, Marionette, ConnectionView, ShmdataTemplate ) {

    /**
     * Shmdata View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var Shmdata = Marionette.CompositeView.extend( {
        template: _.template( ShmdataTemplate ),
        className: 'shmdata',
        childView: ConnectionView,
        childViewContainer: '.connections',

        /**
         * Initialize
         */
        initialize: function( ) {
            //console.log( this.get('shmdatas'));
            //this.collection = this.get('shmdatas');
        }
    } );

    return Shmdata;
} );
