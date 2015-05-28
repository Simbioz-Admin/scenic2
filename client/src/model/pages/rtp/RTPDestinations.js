"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/PropertyWatcherCollection',
    'model/pages/rtp/RTPDestination'
], function ( _, Backbone, PropertyWatcherCollection, RTPDestination ) {

    /**
     * RTP Destinations
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var RTPDestinations = PropertyWatcherCollection.extend( {
        model: RTPDestination,

        /**
         * Initialization
         * A property option is passed to the collection, this is the property that will be wrapped in this collection.
         * In that case it is the "destinations-json" property of the rtp quiddity, so that we can expose it as its
         * own collection to render/filter in the ui for example.
         *
         * @param models
         * @param options
         */
        initialize: function ( models, options ) {
            this.quiddityId = app.config.rtp.quiddName;
            this.propertyName = 'destinations-json';
            this.key = 'destinations';

            PropertyWatcherCollection.prototype.initialize.apply(this,arguments);
            /*
            // Setup listeners for quiddity additions/removals
            this.listenTo( app.quiddities, 'add', this._onQuiddityAdded );
            this.listenTo( app.quiddities, 'remove', this._onQuiddityRemoved );

            // Setup the sip quiddity (if it exists)
            this.quiddity = app.quiddities.get( app.config.rtp.quiddName );
            this._registerRTPQuiddity();*/
        },

       /* /!**
         * Quiddity Added Handler
         * Will check for the addition of the RTP quiddity in order to watch its properties
         *
         * @param quiddity
         * @private
         *!/
        _onQuiddityAdded: function ( quiddity, quiddities, options ) {
            if ( quiddity.id == app.config.rtp.quiddName ) {
                this.quiddity = quiddity;
                this._registerRTPQuiddity();
            }
        },

        /!**
         * Quiddity Removed Handler
         * Stops watching the RTP quiddity when it is removed
         *
         * @param quiddity
         * @private
         *!/
        _onQuiddityRemoved: function ( quiddity, quiddities, options ) {
            if ( quiddity.id == app.config.rtp.quiddName ) {
                this._unregisterRTPQuiddity();
            }
        },

        /!**
         * Registers the rtp quiddity event handlers
         * Will watch for property changes
         *
         * @private
         *!/
        _registerQuiddity: function () {
            if ( this.quiddity ) {
                this.listenTo( this.quiddity.get( 'properties' ), 'add', this._rtpQuiddityPropertyAdded );
                this.listenTo( this.quiddity.get( 'properties' ), 'remove', this._rtpQuiddityPropertyRemoved );

                var destinationsProperty = this.quiddity.get( 'properties' ).get( 'destinations-json' );
                if ( destinationsProperty ) {
                    this.listenTo( destinationsProperty, 'change:value', this.updateDestinations );
                }
            }

            this.updateDestinations();
        },

        /!**
         * Unregisters the rtp quiddity event handlers
         * Will stop watching for property changes
         *
         * @private
         *!/
        _unregisterQuiddity: function () {
            if ( this.quiddity ) {
                this.stopListening( this.quiddity.get( 'properties' ), 'add', this._rtpQuiddityPropertyAdded );
                this.stopListening( this.quiddity.get( 'properties' ), 'remove', this._rtpQuiddityPropertyRemoved );

                var destinationsProperty = this.quiddity.get( 'properties' ).get( 'destinations-json' );
                if ( destinationsProperty ) {
                    this.stopListening( destinationsProperty, 'change:value', this.updateDestinations );
                }

                this.quiddity = null;
            }

            this.updateDestinations();
        },

        /!**
         * Property Added Handler
         * Checks if the rtp quiddity now has a destinations-json property that we can watch
         * Updates the status while we're here
         *
         * @param property
         * @param properties
         * @param options
         * @private
         *!/
        _quiddityPropertyAdded: function ( property, properties, options ) {
            if ( property.id == 'destinations-json' ) {
                this.listenTo( this.quiddity.get( 'properties' ).get( 'destinations-json' ), 'change:value', this.updateDestinations );
                this.updateDestinations();
            }
        },

        /!**
         * Property Removed Handler
         * Stops watching the destinations-json property since it doesn't exist anymore
         *
         * @param property
         * @param properties
         * @param options
         * @private
         *!/
        _quiddityPropertyRemoved: function ( property, properties, options ) {
            if ( property.id == 'destinations-jso' ) {
                this.stopListening( this.quiddity.get( 'properties' ).get( 'destinations-json' ), 'change:value', this.updateDestinations );
                this.updateDestinations();
            }
        },

        /!**
         * Update Destinations
         * Verifies that we have a rtp quiddity which possesses a destinations-json property
         *!/
        _checkProperty: function () {
            if ( this.quiddity ) {
                var destinationsProperty = this.quiddity.get( 'properties' ).get( 'destinations-json' );
                if ( destinationsProperty ) {
                    this.set( destinationsProperty.get( 'value' ).destinations );
                    return;
                }
            }
            this.reset();
        }*/
    } );

    return RTPDestinations;
} );
