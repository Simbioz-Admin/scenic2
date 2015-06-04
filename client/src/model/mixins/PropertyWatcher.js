"use strict";

define( [
    'underscore',
    'app'
], function ( _, app ) {

    /**
     * Property Watcher Mixin
     *
     * @constructor
     */
    var PropertyWatcher = {

        quiddityId: null,
        propertyName: null,
        key: null,

        initialize: function() {
            // Setup listeners for quiddity additions/removals
            this.listenTo( app.quiddities, 'add', this._onQuiddityAdded );
            this.listenTo( app.quiddities, 'remove', this._onQuiddityRemoved );

            // Setup the sip quiddity (if it exists)
            this.quiddity = app.quiddities.get( this.quiddityId );
            this._registerQuiddity();
        },

        /**
         * Quiddity Added Handler
         * Will check for the addition of the quiddity in order to watch its properties
         *
         * @param quiddity
         * @private
         */
        _onQuiddityAdded: function ( quiddity, quiddities, options ) {
            if ( quiddity.id == this.quiddityId ) {
                this.quiddity = quiddity;
                this._registerQuiddity();
            }
        },

        /**
         * Quiddity Removed Handler
         * Stops watching the quiddity when it is removed
         *
         * @param quiddity
         * @private
         */
        _onQuiddityRemoved: function ( quiddity, quiddities, options ) {
            if ( quiddity.id == this.quiddityId ) {
                this._unregisterQuiddity();
            }
        },

        /**
         * Registers the quiddity event handlers
         * Will watch for property changes
         *
         * @private
         */
        _registerQuiddity: function () {
            if ( this.quiddity ) {
                this.listenTo( this.quiddity.get( 'properties' ), 'add', this._quiddityPropertyAdded );
                this.listenTo( this.quiddity.get( 'properties' ), 'remove', this._quiddityPropertyRemoved );

                var property = this.quiddity.get( 'properties' ).get( this.propertyName );
                if ( property ) {
                    this.listenTo( property, 'change:value', this._checkProperty );
                }
            }

            this._checkProperty();
        },

        /**
         * Unregisters the quiddity event handlers
         * Will stop watching for property changes
         *
         * @private
         */
        _unregisterQuiddity: function () {
            if ( this.quiddity ) {
                this.stopListening( this.quiddity.get( 'properties' ), 'add', this._quiddityPropertyAdded );
                this.stopListening( this.quiddity.get( 'properties' ), 'remove', this._quiddityPropertyRemoved );

                var property = this.quiddity.get( 'properties' ).get( this.propertyName );
                if ( property ) {
                    this.stopListening( property, 'change:value', this._checkProperty );
                }

                this.quiddity = null;
            }

            this._checkProperty();
        },

        /**
         * Property Added Handler
         * Checks if the quiddity now has the property that we can watch
         *
         * @param property
         * @param properties
         * @param options
         * @private
         */
        _quiddityPropertyAdded: function ( property, properties, options ) {
            if ( property.id == this.propertyName ) {
                this.listenTo( this.quiddity.get( 'properties' ).get( this.propertyName ), 'change:value', this._checkProperty );
                this._checkProperty();
            }
        },

        /**
         * Property Removed Handler
         * Stops watching the property since it doesn't exist anymore
         *
         * @param property
         * @param properties
         * @param options
         * @private
         */
        _quiddityPropertyRemoved: function ( property, properties, options ) {
            if ( property.id == this.propertyName ) {
                this.stopListening( this.quiddity.get( 'properties' ).get( this.propertyName ), 'change:value', this._checkProperty );
                this._checkProperty();
            }
        },

        /**
         * Update Destinations
         * Verifies that we have a rtp quiddity which possesses a destinations-json property
         */
        _checkProperty: function () {
            if ( this.quiddity ) {
                var property = this.quiddity.get( 'properties' ).get( this.propertyName );
                if ( property && property.get('value') !== null ) {
                    this.propertyChanged( this.key ? property.get( 'value' )[this.key] : property.get('value') );
                    return;
                }
            }
            this.propertyChanged( null );
        },

        propertyChanged: function( value ) {
            //
        }
    };

    return PropertyWatcher;

} );