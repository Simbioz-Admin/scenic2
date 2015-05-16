"use strict";

define( [
    'underscore',
    'backbone',
    'model/Sources',
    'model/base/Destinations'
], function ( _, Backbone, Sources, Destinations ) {

    /**
     * Table
     *
     * @constructor
     * @extends module:Backbone.Model
     */
    var Table = Backbone.Model.extend( {
        defaults: function () {
            return {
                "name":         null,
                "type":         null,
                "description":  null,
                "menus":        [],
                "active":       false,
                "sources":      new Sources(),
                "destinations": new Destinations()
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            // Setup child collections
            // TODO: Setup colections with data respecting the source/destination include/exclude policies
            //this.get( 'sources' ).add( this.getQuidds( 'sources' ), {merge: true} );
            //this.get( 'destinations' ).add( this.getQuidds( 'destinations' ), {merge: true} );
            //TODO: When a source or destination is added, check if it is for a source/destination in the current table
        },

        /**
         * Activate a table
         */
        activate: function () {
            this.collection.setCurrentTable( this );
        },

        /**
         * Filter Quiddity for access from this table
         *
         * @param type
         * @param quiddity
         * @returns {boolean}
         */
        filterQuiddityOrClass: function ( type, quiddity ) {
            var className = quiddity.has( 'class name' ) ? quiddity.get( 'class name' ) : quiddity.get( 'class' );
            var category  = quiddity.get( 'category' );
            var included  = this.has( type ) && this.get( type ).include ? _.some( this.get( type ).include, function ( include ) {
                return category.indexOf( include ) != -1 || className.indexOf( include ) != -1;
            } ) : true;
            var excluded  = this.has( type ) && this.get( type ).exclude ? _.contains( this.get( type ).exclude, category ) : false;
            return included && !excluded;
        }
    } );

    return Table;
} );
