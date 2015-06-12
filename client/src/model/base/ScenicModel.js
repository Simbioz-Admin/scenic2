"use strict";

define( [
    'underscore',
    'backbone',
    'i18n',
    'lib/socket',
    'model/base/BaseModel'
], function ( _, Backbone, i18n, socket, BaseModel ) {

    /**
     * Scenic Model
     * Provides a way to sync models with Scenic using websockets
     *
     * @constructor
     * @extends BaseModel
     */
    var ScenicModel = BaseModel.extend( {

        /**
         * @constructor
         */
        constructor: function() {
            // Main communication channel
            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            /**
             * List of socket listeners
             * @see Same var in ScenicCollection
             * @var {Array}
             */
            this.socketListeners = [];

            // Call the original constructor
            BaseModel.apply(this, arguments);
        },

        /**
         * Initialize
         */
        initialize: function () {
            BaseModel.prototype.initialize.apply( this, arguments );

            // Model Error Handler, goes directly into the vent
            this.on( 'error', function ( model, error ) {
                this.scenicChannel.vent.trigger( 'error', error );
            } );

            // Destroy listener, removes socket listeners
            this.on( 'destroy', _.bind( this._onDestroy, this ) );
        },

        /**
         * Method map
         * Maps Backbone sync methods to our socket methods
         * Supports either strings of functions returning arrays of arguments
         * Can be overridden in sub classes
         */
        methodMap: {
            'create': function () {
                return ['quiddity.create', this.get( 'class' ), this.get( 'name' ), socket.id];
            },
            'update': null,
            'patch':  null,
            'delete': function () {
                return ['quiddity.remove', this.id];
            },
            'read':   null
        },

        /**
         * Listen to socket message on a callback
         * This utility method allows us to remove listeners all at once when destroyed
         *
         * @see Same method in ScenicCollection
         *
         * @param message
         * @param callback
         */
        onSocket: function ( message, callback ) {
            this.socketListeners.push( {message: message, callback: callback} );
            socket.on( message, callback );
        },

        /**
         * Destroy Handler
         * Removes all socket listeners
         *
         * @see Same method in ScenicCollection
         *
         * @private
         */
        _onDestroy: function() {
            _.each( this.socketListeners, function( listener ) {
                socket.off( listener.message, listener.callback );
            });
            this.socketListeners = [];
        },

        /**
         * Overridden Sync Method
         * Supports "syncing" over websocket by mapping CRUD methods to our internal socket messages
         *
         * @param method
         * @param model
         * @param options
         * @returns {*}
         */
        sync: function ( method, model, options ) {
            console.debug( method, model, options );
            var self    = this;
            var command = this.methodMap[method];
            if ( command ) {
                var callback = function ( error, result ) {
                    if ( error ) {
                        return options.error( error );
                    }
                    options.success( result );
                };
                socket.emit.apply( socket, ( typeof command == 'function' ? command.apply( this ) : [command] ).concat( callback ) );
                model.trigger( 'request', model, socket, options );
            } else {
                return options.error( i18n.t('Invalid request __method__', {method: method} ) );
            }
        }
    } );

    return ScenicModel;
} );
