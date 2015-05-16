"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/Tab'
], function ( _, Backbone, Marionette, TabView ) {

    /**
     * Tabs View
     *
     * @constructor
     * @extends module:Marionette.CollectionView
     */

    var TabsView = Marionette.CollectionView.extend( {
        childView: TabView,

        /**
         * Initialize
         */
        initialize: function () {

        }
    } );

    return TabsView;
} );
