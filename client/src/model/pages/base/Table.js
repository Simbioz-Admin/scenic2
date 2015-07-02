"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'app',
    'model/Page',
    'model/Quiddity'
], function ( _, Backbone, socket, app, Page, Quiddity ) {

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
         * Filter class for access in this table
         *
         * @param {ClassDescription} classDescription
         * @param {String[]} filterTags
         * @returns {boolean} Is the class allowed by the filter tags
         * @private
         */
        _filterClass: function( classDescription, filterTags ) {
            return _.some( classDescription.get('tags'), function( tag ) {
                return _.contains( filterTags, tag );
            });
        },

        /**
         * Filter Quiddity for access from this table
         *
         * @param {Quiddity} quiddity - Quiddity to test
         * @param {string[]} [filterTags] - List of allowed tags
         * @param {boolean} filterCategory - Use category filter
         * @returns {boolean} Is the quiddity allowed by the filter tags and/or filter category
         */
        _filterQuiddity: function ( quiddity, filterTags, filterCategory ) {
            var classDescription = quiddity.get('classDescription');
            var classIncluded = filterTags ? this._filterClass(classDescription, filterTags) : true;
            var categoryIncluded = classIncluded && filterCategory && this.get('filter') ? this.get('filter') == classDescription.get('category') : true;
            return classIncluded && categoryIncluded;
        },

        /**
         * Get source collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {Quiddities}
         */
        getSourceCollection: function() {
            return app.quiddities;
        },

        /**
         * Get a list of possible source classes
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {ClassDescription[]}
         */
        getSources : function() {
            return app.classDescriptions.filter( function ( classDescription ) {
                return this._filterClass( classDescription, ['writer'] );
            }, this );
        },

        /**
         * Filter source for this table
         * Override in concrete table classes to filter the actual collection
         *
         * @param {Shmdata} source
         * @param {boolean} useFilter
         * @returns {Quiddity[]}
         */
        filterSource: function( source, useFilter ) {
            return this._filterQuiddity( source, [ 'writer' ], useFilter );
        },

        /**
         * Get destination collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {Quiddities}
         */
        getDestinationCollection: function() {
            return app.quiddities;
        },

        /**
         * Get a list of possible destination classes
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {ClassDescription[]}
         */
        getDestinations: function() {
            return app.classDescriptions.filter( function ( classDescription ) {
                return this._filterClass( classDescription, ['reader'] );
            }, this );
        },

        /**
         * Filter destination for this table
         * Override in concrete table classes to filter the actual collection
         *
         * @param {Quiddity|Object} destination
         * @param {boolean} useFilter
         * @returns {Quiddity[]}
         */
        filterDestination: function( destination, useFilter ) {
            return this._filterQuiddity( destination, ['reader'], useFilter );
        },

        /**
         * Create a quiddity
         *
         * @param {Object} info
         */
        createQuiddity: function ( info ) {
            var self     = this;
            var quiddity = new Quiddity( );
            quiddity.save( {'class': info.type, 'name': info.name}, {
                success: function ( quiddity ) {
                    if ( info.device ) {
                        //TODO: What is this I don't even
                        alert('What is this I don\'t even');
                        quiddity.setProperty( 'device', info.device );
                    }
                }
            } );
        },

        /**
         * Check if this quiddity is connected to a shmdata
         * Override in concrete table classes
         *
         * @param {Shmdata} source
         * @param {Quiddity|Object} destination
         * @return {boolean}
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
         * @param {Shmdata} source
         * @param {Quiddity|Object} destination
         * @param {Function} callback
         */
        canConnect: function( source, destination, callback ) {
            callback( false );
            return false;
        },

        /**
         * Connect a source to a destination
         * Override in concrete table classes
         *
         * @param {Shmdata} source
         * @param {Quiddity|*} destination
         */
        connect: function( source, destination ) {
            //
        },

        /**
         * Disconnect a srouce form its destination
         * Override in concrete table classes
         *
         * @param {Shmdata} source
         * @param {Quiddity|*} destination
         */
        disconnect: function( source, destination ) {
            //
        }
    } );

    return Table;
} );