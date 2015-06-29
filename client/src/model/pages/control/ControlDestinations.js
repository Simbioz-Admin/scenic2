"use strict";

define( [
    'underscore',
    'backbone',
    'model/pages/control/ControlDestination'
], function ( _, Backbone, ControlDestination ) {

    /**
     * Control Destinations
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var ControlDestinations = Backbone.Collection.extend( {
        model: ControlDestination,
        comparator: function( controlDestination ) {
            var quiddity = controlDestination.get('property' ).collection.quiddity;
            return quiddity.get('classDescription' ).get('category') + '.' + quiddity.get('class') + '.' + quiddity.id + '.' + controlDestination.get('property' ).get('order');

        },

        /**
         * Initialization
         * A quiddities option is passed to the collection, this is the collection that will be wrapped in this collection.
         *
         * @param models
         * @param options
         */
        initialize: function ( models, options ) {
            this.quiddities = options.quiddities;

            // By listening to "wrappedCollection" and using "set" we are merely wrapping/filtering the collection
            this.listenTo( this.quiddities, 'update', this.updateCollection, this );

            // Call it to initialize
            this.updateCollection();
        },

        /**
         * Update the wrapper collection from the property value
         * We start by cloning the actual models, this way we'll always keep the temporarily
         * or unmapped properties in the table (the only thing telling us a property should be
         * there otherwise is the mapper)
         *
         * Properties will only be removed from the table when explicitly removed.
         *
         * This is valid only for the current session, refreshing the page or seeing from another
         * session will not keep unmapped properties in the table.
         */
        updateCollection: function () {
            var destinations = _.clone(this.models);

            // Find all property mappers
            var mappers = this.quiddities.where( { 'class': 'property-mapper' } );
            _.each( mappers, function ( mapper ) {
                var tree = mapper.get( 'tree' );
                if ( !tree || !tree.sink || !tree.sink.quiddity || !tree.sink.property ) {
                    return;
                }
                var quiddity = this.quiddities.get( tree.sink.quiddity );
                if ( !quiddity ) {
                    return;
                }
                var property = quiddity.get( 'properties' ).get( tree.sink.property );
                if ( property ) {
                    destinations.push( {
                        id: property.collection.quiddity.id + '.' + property.id,
                        property: property
                    } );
                }
            }, this );

            // By resetting we are simplifying the control connection update process
            // It would be better to just update (set) but then it doesn't trigger when the properties stay the same
            this.reset( destinations );
        }
    } );

    return ControlDestinations;
} );
