'use strict';

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/quiddity/Property'
], function ( _, Backbone, socket, ScenicCollection, Property ) {

    /**
     * Property Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var Properties = ScenicCollection.extend( {
        model:     Property,
        comparator: 'order',
        quiddity:  null,
        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function () {
                return ['getProperties', this.quiddity.id]
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicCollection.prototype.initialize.apply( this, arguments );

            //Handlers
            this.onSocket( 'onSignal', _.bind( this._onSignal, this ) );
            this.onSocket( 'propertyChanged', _.bind( this._onPropertyChanged, this ) );
        },

        /**
         * Signals Property Info Handler
         * Listens to property additions concerning our parent quiddity and add properties if it matches
         *
         * @param {string} quiddityId The name of the quiddity
         * @param {string} signal The type of event on property or method
         * @param {string} name The name of the property or method
         */
        _onSignal: function ( quiddityId, signal, name ) {
            if ( signal == 'on-property-added' && this.quiddity.id == quiddityId ) {
                var property = this.add( {id: name}, {merge: true} );
                //console.debug( 'Property info', property );
                // The property is empty at this point, fetch its content
                property.fetch();
            }
        },

        /**
         *  Signals Property Value Handler
         *  Listens for property value changes and add the property if we don't have it
         *
         *  @param {string} quiddityId The name of the quiddity
         *  @param {string} key The name of the property or method
         *  @param {string} value The value of the property
         */
        _onPropertyChanged: function ( quiddityId, key, value ) {
            if ( this.quiddity.id == quiddityId && this.get(key) == null ) {
                // Somehow the property doesn't exists, create it but stay safe with merge
                var property = this.add({id: key, value:value}, {merge:true});
                //console.debug( 'Property value', property );
                // We were not aware of this property, so fetch it
                property.fetch();
            }
        }
    } );

    return Properties;
} );
