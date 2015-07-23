"use strict";

define( [
    'underscore',
    'backbone',
    'model/Page',
    'model/Quiddity'
], function ( _, Backbone, Page, Quiddity ) {

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
        initialize: function ( attributes, options ) {
            Page.prototype.initialize.apply( this, arguments );
            this.set( 'filter', null );
        },

        /**
         * Filter class for access in this table
         *
         * @param {ClassDescription} classDescription
         * @param {String[]} filterTags
         * @param {boolean} [allTagsShouldMatch] Set to true to AND tags instead of the default OR
         * @returns {boolean} Is the class allowed by the filter tags
         * @private
         */
        _filterClass: function ( classDescription, filterTags, allTagsShouldMatch ) {
            var f = allTagsShouldMatch ? _.every : _.some;
            var tags = classDescription.get( 'tags' );
            return f( filterTags, function ( tag ) {
                return _.contains( tags, tag );
            } );
        },

        /**
         * Filter Quiddity for access from this table
         *
         * @param {Quiddity} quiddity - Quiddity to test
         * @param {string[]} [filterTags] - List of allowed tags
         * @param {boolean} [allTagsShouldMatch] Set to true to AND tags instead of the default OR
         * @param {boolean} [filterCategory] - Use category filter
         * @returns {boolean} Is the quiddity allowed by the filter tags and/or filter category
         * @private
         */
        _filterQuiddity: function ( quiddity, filterTags, allTagsShouldMatch, filterCategory ) {
            var classDescription = quiddity.get('classDescription');
            var classIncluded = filterTags ? this._filterClass(classDescription, filterTags, allTagsShouldMatch) : true;
            var categoryIncluded = classIncluded && filterCategory && this.get('filter') ? this.get('filter') == classDescription.get('category') : true;
            return classIncluded && categoryIncluded;
        },

        /**
         * Get source collection
         *
         * This is the collection from which sources are picked/filtered. This is not
         * the actual displayed sources, only the collection from where they are chosen.
         *
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {Quiddities}
         */
        getSourceCollection: function () {
            return this.scenic.quiddities;
        },

        /**
         * Get a list of possible source classes for the menu
         *
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {ClassDescription[]}
         */
        getSources: function () {
            return this.scenic.classes.filter( function ( classDescription ) {
                return this._filterClass( classDescription, ['writer'] );
            }, this );
        },

        /**
         * Filter source for this table
         *
         * Override in concrete table classes to filter the actual collection
         *
         * @param {Shmdata} source
         * @param {boolean} useFilter
         * @returns {Quiddity[]}
         */
        filterSource: function ( source, useFilter ) {
            return this._filterQuiddity( source, ['writer'], false, useFilter );
        },

        /**
         * Get destination collection
         *
         * This is the collection from which destinations are picked/filtered. This is not
         * the actual displayed destinations, only the collection from where they are chosen.
         *
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {Quiddities}
         */
        getDestinationCollection: function () {
            return this.scenic.quiddities;
        },

        /**
         * Get a list of possible destination classes for the menu.
         *
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {ClassDescription[]}
         */
        getDestinations: function () {
            return this.scenic.classes.filter( function ( classDescription ) {
                return this._filterClass( classDescription, ['reader'] );
            }, this );
        },

        /**
         * Filter destination for this table
         *
         * Override in concrete table classes to filter the actual collection
         *
         * @param {Quiddity|Object} destination
         * @param {boolean} useFilter
         * @returns {Quiddity[]}
         */
        filterDestination: function ( destination, useFilter ) {
            return this._filterQuiddity( destination, ['reader'], false, useFilter );
        },

        /**
         * Create a quiddity
         *
         * @param {Object} info
         */
        createQuiddity: function ( info ) {
            var self     = this;
            var quiddity = new Quiddity(null, {scenic: this.scenic});
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
        isConnected: function ( source, destination ) {
            // Check if already connected
            var shmdataReaders = destination.shmdatas.where( {
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
        canConnect: function ( source, destination, callback ) {
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
        connect: function ( source, destination ) {
            //
        },

        /**
         * Disconnect a srouce form its destination
         * Override in concrete table classes
         *
         * @param {Shmdata} source
         * @param {Quiddity|*} destination
         */
        disconnect: function ( source, destination ) {
            //
        }
    } );

    return Table;
} );