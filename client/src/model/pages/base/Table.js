"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/Page',
    'model/Quiddity'
], function ( _, Backbone, socket, Page, Quiddity ) {

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
            this.scenicChannel   = Backbone.Wreqr.radio.channel( 'scenic' );
            this.set('filter', null);
        },

        /**
         * Filter Quiddity for access from this table
         *
         * @param type
         * @param quiddity
         * @returns {boolean}
         */
        _filterQuiddityOrClass: function ( type, quiddity, useFilter ) {
            var className = quiddity.has( 'class name' ) ? quiddity.get( 'class name' ) : quiddity.get( 'class' );
            var category  = quiddity.get( 'category' );
            var included  = this.has( type ) && this.get( type ).include ? _.some( this.get( type ).include, function ( include ) {
                return category.indexOf( include ) != -1 || className.indexOf( include ) != -1;
            } ) : true;
            var excluded  = this.has( type ) && this.get( type ).exclude ? _.contains( this.get( type ).exclude, category ) : false;
            var filtered = useFilter && this.get('filter') ? this.get('filter') != category : false;
            return included && !excluded && !filtered;
        },

        filterSource: function( quiddity, useFilter ) {
            return this._filterQuiddityOrClass( 'source', quiddity, useFilter );
        },

        filterDestination: function( quiddity, useFilter ) {
            return this._filterQuiddityOrClass( 'destination', quiddity, useFilter );
        },

        /**
         * Get source collection
         *
         * @returns {quiddities|*}
         */
        getSourceCollection: function() {
            return app.quiddities;
        },

        /**
         * Get a list of possible source classes
         * @returns {Array.<T>|*|boolean}
         */
        getSources : function() {
            return app.classDescriptions.filter( function ( classDescription ) {
                return this.filterSource( classDescription );
            }, this );
        },

        /**
         * Get a list of possible destination classes
         * @returns {Array.<T>|*|boolean}
         */
        getDestinations: function() {
            return app.classDescriptions.filter( function ( classDescription ) {
                return this.filterDestination( classDescription );
            }, this );
        },

        /**
         * Get destination collection
         *
         * @returns {quiddities|*}
         */
        getDestinationCollection: function() {
            return app.quiddities;
        },

        /**
         * Create a quiddity
         *
         * @param info
         */
        createQuiddity: function ( info ) {
            var self     = this;
            var quiddity = new Quiddity( {'class': info.type, 'newName': info.name} );
            quiddity.save( null, {
                success: function ( quiddity ) {
                    if ( info.device ) {
                        //TODO: What is this I don't even
                        quiddity.setProperty( 'device', info.device );
                    }
                },
                error:   function ( error ) {
                    self.scenicChannel.vent.trigger( 'error', error );
                }
            } );
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