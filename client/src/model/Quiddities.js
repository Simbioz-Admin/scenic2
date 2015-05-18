"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/Quiddity'
], function ( _, Backbone, socket, ScenicCollection, Quiddity ) {

    /**
     * Quiddities Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var Quiddities = ScenicCollection.extend( {
        model: Quiddity,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'getQuiddities'
        },

        /**
         * Ignored quiddities
         * Internal quiddities for which we don't really care in the UI
         * TODO: Put this on the server so that we never know about them
         */
        ignoredQuiddities: [
            'dico',
            'create_remove_spy',
            'rtpsession',
            'logger',
            'runtime',
            'logger',
            'SOAPcontrolServer'
        ],

        /**
         * Initialize
         */
        initialize: function () {
            ScenicCollection.prototype.initialize.apply( this, arguments );

            // Handlers
            this.onSocket( "create", _.bind( this._onCreate, this ) );
        },

        /**
         * Create Handler
         * Listens to quididity creations and add/merge new quiddities to the collection
         *
         * @private
         * @param quiddityData
         * @param socketId
         */
        _onCreate: function ( quiddityData, socketId ) {
            if ( !_.contains( this.ignoredQuiddities, quiddityData.class ) ) {
                var quiddity = this.add( quiddityData, {merge: true} );
                this.scenicChannel.vent.trigger('quiddity:added', quiddity);
                // If we created it, start editing it
                if ( socket.id == socketId ) {
                    //TODO: Send quiddity:created with local flag instead
                    quiddity.edit();
                }
            }
        },


        //
        //
        //
        //
        //






        /**
         *  Ask to the server switcher the property value of a specific quiddity
         *  @param {string} Name of the quiddity
         *  @param {string} property The name of the property
         *  @param {function} callback callback to send the value
         */

        getPropertyValue: function ( quiddName, property, callback ) {
            socket.emit( "get_property_value", quiddName, property, function ( err, propertyValue ) {
                if ( err ) {
                    return views.global.notification( 'error', err );
                }
                callback( propertyValue );
            } );
        }
    } );

    return Quiddities;
} );