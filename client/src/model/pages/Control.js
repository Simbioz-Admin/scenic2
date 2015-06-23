"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'i18n',
    'app',
    'model/pages/base/Table',
    'model/pages/control/ControlDestinations'
], function ( _, Backbone, socket, i18n, app, Table, ControlDestinations ) {

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

        allowedPropertyTypes: [ 'int', 'double' ],

        /**
         * Initialize
         */
        initialize: function () {
            Table.prototype.initialize.apply( this, arguments );
        },

        /**
         * Get destination collection
         * Override in concrete table classes to retrieve the actual collection
         *
         * @returns {ControlDestination[]}
         */
        getDestinationCollection: function() {
            if ( !this.destinations ) {
                this.destinations = new ControlDestinations( null, {quiddities: app.quiddities} );
            }
            return this.destinations;
        },

        /**
         * Filter destination for Control, as we use a special collection, they all pass the test
         *
         * @inheritdoc
         */
        filterDestination: function( destination, useFilter ) {
            return true;
        },

        /**
         * Get a list of controllable properties
         */
        getControlProperties: function() {
            //TODO: Remove already assigned
            // Get source quiddity classes
            var quiddities = app.quiddities.filter( function ( quiddity ) {
                return this._filterQuiddity( quiddity, [ 'writer', 'reader' ] );
            }, this );
            var controllables = [];
            _.each( quiddities , function( quiddity ) {
                var properties = quiddity.get('properties' ).filter( function( property ) {
                    return property.get('writable') && _.contains( this.allowedPropertyTypes, property.get('type') );
                }, this );
                controllables = controllables.concat( properties );
            }, this );
            return controllables;
        },

        createPropertyDestination: function( quiddity, property ) {
            this.destinations.add( app.quiddities.get(quiddity ).get('properties' ).get(property), {merge:true});
        },

        /**
         * Get connections
         *
         * @param {Property} source
         * @param {Property} destination
         * @returns {*}
         */
        getConnection: function( source, destination ) {
            //return _.findWhere( destination.get('data_streams'), { path: source.get('path') } );
            return null;
        },

        /**
         * @inheritdoc
         * @param {Property} source
         * @param {Property} destination
         * @return {boolean}
         */
        isConnected: function( source, destination ) {
            return this.getConnection(source, destination) != null;
        },

        /**
         * @inheritdoc
         * @param {Property} source
         * @param {Property} destination
         * @param {Function} callback
         */
        canConnect: function( source, destination, callback ) {
            var can = source.get('type') == destination.get('type');
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
            socket.emit( 'control.mapping.add', source.collection.quiddity.id, source.id, destination.collection.quiddity.id, destination.id, function( error ) {
                if ( error ) {
                    console.error( error );
                    self.scenicChannel.vent.trigger( 'error', error );
                    return;
                }
            } );
        },

        /**
         * @inheritdoc
         * @param {Property} source
         * @param {Property} destination
         */
        disconnect: function( source, destination ) {
            /*var self = this;
            socket.emit( 'rtp.destination.disconnect', source.get('path'), destination.id, function( error ) {
                if ( error ) {
                    console.error( error );
                    self.scenicChannel.vent.trigger( 'error', error );
                    return cb( error );
                }
            } );*/
        }

    } );

    return Control;
} );