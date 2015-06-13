"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/application/SessionView'
], function ( _, Backbone, Marionette, SessionView ) {

    /**
     * Sessions View
     *
     * @constructor
     * @extends module:Marionette.CollectionView
     */

    var SessionsView = Marionette.CollectionView.extend( {
        childView: SessionView,

        /**
         * Initialize
         */
        initialize: function () {

        }
    } );

    return SessionsView;
} );
