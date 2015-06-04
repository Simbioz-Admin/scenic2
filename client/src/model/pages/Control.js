"use strict";

define( [
    'jquery',
    'underscore',
    'backbone',
    'lib/socket',
    'app',
    'model/pages/base/Table',
    'model/pages/control/ControlDestinations'
], function ( $, _, Backbone, socket, app, Table, ControlDestinations ) {

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
                name:        $.t( "Control" ),
                type:        "control",
                description: $.t( "Control properties of quiddities with devices" ),
                source:      {
                    include: ["midisrc"]
                },
                control:      {
                    include: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"],
                    exclude: ["midisrc"]
                }
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
         * @returns {quiddities|*}
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