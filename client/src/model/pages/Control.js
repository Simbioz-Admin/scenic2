"use strict";

define( [
    'underscore',
    'backbone',
    'i18n',
    'model/pages/base/Table',
    'model/pages/control/ControlDestinations'
], function ( _, Backbone, i18n, Table, ControlDestinations ) {

    /**
     * Control Table
     *
     * @constructor
     * @extends Table
     */

    var Control = Table.extend( {

        defaults: function () {
            return {
                id:          "control",
                name:        i18n.t( "Control" ),
                type:        "control",
                description: i18n.t( "Control properties of quiddities with devices" )
            }
        },

        allowedPropertyTypes: ['int', 'double'],

        /**
         * Initialize
         */
        initialize: function ( attributes, options ) {
            Table.prototype.initialize.apply( this, arguments );
        },

        /**
         * Get destination collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {ControlDestination[]}
         */
        getDestinationCollection: function () {
            if ( !this.destinations ) {
                this.destinations = new ControlDestinations( null, {scenic: this.scenic, quiddities: this.scenic.quiddities} );
            }
            return this.destinations;
        },

        /**
         * Filter destination for Control, as we use a special collection, they all pass the test
         *
         * @inheritdoc
         */
        filterDestination: function ( destination, useFilter ) {
            return true;
        },

        /**
         * Get a list of controllable properties
         */
        getDestinations: function () {
            // Get source quiddity classes
            var quiddities    = this.scenic.quiddities.filter( function ( quiddity ) {
                return this._filterQuiddity( quiddity, ['writer', 'reader'] );
            }, this );
            var controllables = [];
            _.each( quiddities, function ( quiddity ) {
                var properties = quiddity.properties.filter( function ( property ) {
                    return property.get( 'writable' ) && _.contains( this.allowedPropertyTypes, property.get( 'type' ) ) && !this.destinations.get(quiddity.id + '.' + property.id);
                }, this );
                controllables  = controllables.concat( properties );
            }, this );
            return controllables;
        },

        createPropertyDestination: function ( quiddityId, propertyId ) {
            var property    = this.scenic.quiddities.get( quiddityId ).properties.get( propertyId );
            var destination = {
                id:       property.collection.quiddity.id + '.' + property.id,
                property: property
            };
            this.destinations.add( destination, { merge: true, scenic: this.scenic } );
        },

        /**
         * Get connections
         *
         * @param {Property} source
         * @param {Property} destination
         * @returns {*}
         */
        getConnection: function ( source, destination ) {
            return _.find( this.scenic.quiddities.where( { 'class': 'property-mapper' } ), function ( mapper ) {
                var tree = mapper.get( 'tree' );
                if ( !tree || !tree.source || !tree.source.quiddity || !tree.source.property || !tree.sink || !tree.sink.quiddity || !tree.sink.property ) {
                    return false;
                } else {
                    return tree.source.quiddity == source.collection.quiddity.id &&
                           tree.source.property == source.id &&
                           tree.sink.quiddity == destination.get( 'property' ).collection.quiddity.id &&
                           tree.sink.property == destination.get( 'property' ).id;

                }
            }, this );
        },

        /**
         * @inheritdoc
         * @param {Property} source
         * @param {Property} destination
         * @return {boolean}
         */
        isConnected: function ( source, destination ) {
            return this.getConnection( source, destination ) != null;
        },

        /**
         * @inheritdoc
         * @param {Property} source
         * @param {Property} destination
         * @param {Function} callback
         */
        canConnect: function ( source, destination, callback ) {
            var can = true;//source.get('type') == destination.get('type');
            callback( can );
            return can;
        },

        /**
         * @inheritdoc
         * @param {Property} source
         * @param {Property} destination
         */
        connect: function ( source, destination ) {
            var self = this;
            this.scenic.socket.emit( 'control.mapping.add', source.collection.quiddity.id, source.id, destination.get( 'property' ).collection.quiddity.id, destination.get( 'property' ).id, function ( error ) {
                if ( error ) {
                    console.error( error );
                    self.scenic.sessionChannel.vent.trigger( 'error', error );
                    return;
                }
            } );
        },

        /**
         * @inheritdoc
         * @param {Property} source
         * @param {Property} destination
         */
        disconnect: function ( source, destination ) {
            var connection = this.getConnection( source, destination );
            if ( connection ) {
                connection.destroy();
            }
        }

    } );

    return Control;
} );