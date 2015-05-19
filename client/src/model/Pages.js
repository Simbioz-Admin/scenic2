"use strict";

define( [
    'underscore',
    'jquery',
    'backbone',
    'model/pages/base/Page'
], function ( _, $, Backbone, Page ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Collection
     */
    var Pages = Backbone.Collection.extend( {
        model:        Page,
        currentPage: null,

        initialize: function ( models, options ) {
            this.config = options.config;
        },

        /**
         * Get the current page
         *
         * @returns {*}
         */
        getCurrentPage: function () {
            if ( this.currentPage ) {
                return this.currentPage;
            } else if ( localStorage.getItem( 'currentPage' ) ) {
                return this.get( localStorage.getItem( 'currentPage' ) );
            } else {
                return this.get( this.config.defaultPanelPage );
            }
        },

        /**
         * Set current page
         *
         * @param page
         */
        setCurrentPage: function ( page ) {
            this.each( function ( page ) {
                page.set( 'active', false );
            } );

            this.currentPage = page;
            localStorage.setItem( 'currentPage', this.currentPage ? this.currentPage.get( 'id' ) : null );

            if ( this.currentPage ) {
                this.currentPage.set( 'active', true );
            }

            this.trigger( 'change:current', this.currentPage );
        }
    } );

    return Pages;
} );
