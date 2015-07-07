"use strict";

define( [
    'underscore',
    'backbone',
    'i18n',
    'model/base/BaseModel'
], function ( _, Backbone, i18n, BaseModel ) {

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
        constructor: function(attributes, options ) {
            if ( options && options.scenic) {
                this.scenic = options.scenic;
            }

            if ( this.scenic == undefined ) {
                console.error('Scenic model requires a reference to the active scenic session.');
                return;
            }

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
        initialize: function (attributes, options) {
            BaseModel.prototype.initialize.apply( this, arguments );

            // Model Error Handler, goes directly into the vent
            this.on( 'error', function ( model, error ) {
                this.scenic.sessionChannel.vent.trigger( 'error', error );
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
                return ['quiddity.create', this.get( 'class' ), this.get( 'name' ), this.scenic.socket.id];
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
            this.scenic.socket.on( message, callback );
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
                this.scenic.socket.off( listener.message, listener.callback );
            }, this);
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
            var self    = this;
            var command = this.methodMap[method];
            if ( command ) {
                var callback = function ( error, result ) {
                    if ( error ) {
                        return options.error( error );
                    }
                    options.success( result );
                };
                this.scenic.socket.emit.apply( this.scenic.socket, ( typeof command == 'function' ? command.apply( this ) : [command] ).concat( callback ) );
                model.trigger( 'request', model, this.scenic.socket, options );
            } else {
                return options.error( i18n.t('Invalid request __method__', {method: method} ) );
            }
        }
    } );

    return ScenicModel;
} );
