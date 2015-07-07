'use strict';

define( [
    'underscore',
    'backbone',
    'model/base/ScenicCollection',
    'model/quiddity/Property'
], function ( _, Backbone, ScenicCollection, Property ) {

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
                return ['quiddity.property.list', this.quiddity.id]
            }
        },

        /**
         * Initialize
         */
        initialize: function (models, options) {
            ScenicCollection.prototype.initialize.apply( this, arguments );
            this.quiddity = options.quiddity;
        },

        /**
         * Bind to socket
         * This is done so that temporary models don't register with socket.io
         * This was causing them to keep being referenced event after being used
         */
        bindToSocket: function() {
            this.onSocket( 'propertyChanged', _.bind( this._onPropertyChanged, this ) );
            this.onSocket( 'quiddity.property.added', _.bind( this._onPropertyAdded, this ) );
        },

        /**
         * Property Added Handler
         *
         * @param {string} quiddityId The name of the quiddity
         * @param {Object} property The name of the property
         */
        _onPropertyAdded: function ( quiddityId, property ) {
            if ( this.quiddity.id == quiddityId ) {
                this.add( property, {merge: true, parse: true} );
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
                console.warn('This should not happen');
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
