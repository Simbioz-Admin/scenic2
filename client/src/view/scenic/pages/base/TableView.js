"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/pages/base/table.html'
], function ( _, Backbone, Marionette, TableTemplate ) {

    /**
     *  @constructor
     *  @augments module:Marionette.LayoutView
     */
    var Table = Marionette.LayoutView.extend( {
        tagName:   'div',
        className: 'table',
        template:  _.template( TableTemplate ),
        regions:   {
            'menus':        '.menus',
            'destinations': '.destinations',
            'sources':      '.sources'
        },

        /**
         * Initialize
         */
        initialize: function () {

        }
    } );

    return Table;
} );
