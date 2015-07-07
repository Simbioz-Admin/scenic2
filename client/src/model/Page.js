"use strict";

define( [
    'underscore',
    'backbone'
], function ( _, Backbone ) {

    /**
     * Page
     *
     * @constructor
     * @extends module:Backbone.Model
     */

    var Page = Backbone.Model.extend( {

        defaults: {
            id:          null,
            name:        null,
            type:        null,
            description: null,
            menus:       []
        },

        /**
         * Initialize
         */
        initialize: function ( attributes, options ) {
            this.scenic = options.scenic;
            this.viewClass = options.viewClass;
            this.set('active', localStorage.getItem( 'currentPage' ) == this.id );
        },

        /**
         * Activate a page
         */
        activate: function () {
            this.collection.setCurrentPage( this );
        },

        /**
         * Get View Instance
         */
        getViewInstance: function() {
            return new (this.viewClass)( { model: this, scenic: this.scenic } );
        }
    } );

    return Page;
} );