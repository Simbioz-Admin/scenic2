"use strict";

define( [
    '../../../bower_components/underscore/underscore',
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
        initialize: function ( options ) {
            // Main communication channel
            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

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
            return new (this.viewClass)( { model: this } );
        }
    } );

    return Page;
} );