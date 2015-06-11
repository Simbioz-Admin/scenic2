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
         * Get a list of controllable properties
         */
        getControlProperties: function() {
            //TODO: Remove already assigned
            // Get source quiddity classes
            var quiddities = app.quiddities.filter( function ( quiddity ) {
                return this._filterQuiddityOrClass( 'control', quiddity );
            }, this );
            var controllables = [];
            _.each( quiddities , function( quiddity ) {
                var properties = quiddity.get('properties' ).filter( function( property ) {
                    return property.get('writable') == 'true' && property.get('name') != 'started';
                }, this );
                controllables = controllables.concat( properties );
            }, this );
            return controllables;
        }
    } );

    return Control;
} );