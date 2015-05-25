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
            var className = quiddity.get( 'class' );
            var category  = quiddity.get( 'category' );
            var included  = this.has( type ) && this.get( type ).include ? _.some( this.get( type ).include, function ( include ) {
                return category.indexOf( include ) != -1 || className.indexOf( include ) != -1;
            } ) : true;
            var excluded  = this.has( type ) && this.get( type ).exclude ? _.contains( this.get( type ).exclude, category ) : false;
            var filtered = useFilter && this.get('filter') ? this.get('filter') != category : false;
            return included && !excluded && !filtered;
        },

        /**
         * Get source collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {quiddities|*}
         */
        getSourceCollection: function() {
            return app.quiddities;
        },

        /**
         * Get a list of possible source classes
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {Array.<T>|*|boolean}
         */
        getSources : function() {
            return app.classDescriptions.filter( function ( classDescription ) {
                return this.filterSource( classDescription );
            }, this );
        },

        /**
         * Filter source for this table
         * Override in concrete table classes to filter the actual collection
         *
         * @param source
         * @param useFilter
         * @returns {*|boolean}
         */
        filterSource: function( source, useFilter ) {
            return this._filterQuiddityOrClass( 'source', source, useFilter );
        },

        /**
         * Get destination collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {quiddities|*}
         */
        getDestinationCollection: function() {
            return app.quiddities;
        },

        /**
         * Get a list of possible destination classes
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {Array.<T>|*|boolean}
         */
        getDestinations: function() {
            return app.classDescriptions.filter( function ( classDescription ) {
                return this.filterDestination( classDescription );
            }, this );
        },

        /**
         * Filter destination for this table
         * Override in concrete table classes to filter the actual collection
         *
         * @param destination
         * @param useFilter
         * @returns {*|boolean}
         */
        filterDestination: function( destination, useFilter ) {
            return this._filterQuiddityOrClass( 'destination', destination, useFilter );
        },

        /**
         * Create a quiddity
         *
         * @param info
         */
        createQuiddity: function ( info ) {
            var self     = this;
            var quiddity = new Quiddity( {'class': info.type, 'name': info.name} );
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
         * Check if this quiddity is connected to a shmdata
         * Override in concrete table classes
         *
         * @param source
         * @param destination
         * @return bool
         */
        isConnected: function( source, destination ) {
            // Check if already connected
            var shmdataReaders = destination.get( "shmdatas" ).where( {
                type: 'reader'
            } );
            if ( !shmdataReaders || shmdataReaders.length == 0 ) {
                return false;
            }
            return _.some( shmdataReaders, function ( shm ) {
                return ( shm.get( 'path' ) == source.get( 'path' ) );
            } );
        },

        /**
         * Check if a source can connect to a destination
         * Override in concrete table classes
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
         * Override in concrete table classes
         *
         * @param source
         * @param destination
         */
        connect: function( source, destination ) {
            //
        },

        /**
         * Disconnect a srouce form its destination
         * Override in concrete table classes
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