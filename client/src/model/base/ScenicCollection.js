"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/BaseCollection',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, BaseCollection, ScenicModel ) {

    /**
     * Scenic Collection
     * Provides a way to sync collections with Scenic using websockets
     *
     * @constructor
     * @extends BaseModel
     */
    var ScenicCollection = BaseCollection.extend( {
        model: ScenicModel,

        /**
         * Initialize
         */
        initialize: function () {
            BaseCollection.prototype.initialize.apply( this, arguments );

            // Main communication channel
            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            // Collection Error Handler, goes directly into the vent
            this.on( 'error', function ( model, error ) {
                this.scenicChannel.vent.trigger( 'error', error );
            } );
        },

        /**
         * Method map
         * Maps Backbone sync methods to our socket methods
         * Supports either strings of functions returning arrays of arguments
         * Can be overridden in sub classes
         */
        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   null
        },

        /**
         * Overridden Sync Method
         * Supports "syncing" over websocket by mapping CRUD methods to our internal socket messages
         *
         * @param method
         * @param collection
         * @param options
         * @returns {*}
         */
        sync: function ( method, collection, options ) {
            var command = this.methodMap[method];
            if ( command ) {
                var callback = function ( error, result ) {
                    if ( error ) {
                        return options.error( error );
                    }
                    options.success( result );
                };
                socket.emit.apply( socket, ( typeof command == 'function' ? command.apply( this ) : [command] ).concat( callback ) );
                collection.trigger( 'request', collection, socket, options );
            } else {
                return options.error( 'Invalid request' );
            }
        }
    } );

    return ScenicCollection;
} );
