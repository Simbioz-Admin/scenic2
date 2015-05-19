"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/Page'
], function ( _, Backbone, socket, Page ) {

    /**
     * Table Page
     *
     * @constructor
     * @extends Page
     */

    var Table = Page.extend( {

        /**
         * Initialize
         */
        initialize: function () {
            Page.prototype.initialize.apply( this, arguments );
            this.set('filter', null);
        },

        /**
         * Filter Quiddity for access from this table
         *
         * @param type
         * @param quiddity
         * @returns {boolean}
         */
        filterQuiddityOrClass: function ( type, quiddity, useFilter ) {
            var className = quiddity.has( 'class name' ) ? quiddity.get( 'class name' ) : quiddity.get( 'class' );
            var category  = quiddity.get( 'category' );
            var included  = this.has( type ) && this.get( type ).include ? _.some( this.get( type ).include, function ( include ) {
                return category.indexOf( include ) != -1 || className.indexOf( include ) != -1;
            } ) : true;
            var excluded  = this.has( type ) && this.get( type ).exclude ? _.contains( this.get( type ).exclude, category ) : false;
            var filtered = useFilter && this.get('filter') ? this.get('filter') != category : false;
            return included && !excluded && !filtered;
        },

        getSources : function() {
            return app.classDescriptions.filter( function ( classDescription ) {
                return this.filterQuiddityOrClass( 'source', classDescription );
            }, this );
        },

        getDestinations: function() {
            return app.classDescriptions.filter( function ( classDescription ) {
                return this.filterQuiddityOrClass( 'destination', classDescription );
            }, this );
        },

        /**
         * Check if a source can connect to a destination
         *
         * @param source
         * @param destination
         * @param callback
         */
        canConnect: function( source, destination, callback ) {
            //
        },

        /**
         * Connect a source to a destination
         *
         * @param source
         * @param destination
         */
        connect: function( source, destination ) {
            //
        },

        /**
         * Disconnect a srouce form its destination
         *
         * @param source
         * @param destination
         */
        disconnect: function( source, destination ) {
            //
        }
    } );

    return Table;
} );