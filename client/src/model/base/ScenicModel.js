"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/BaseModel'
], function ( _, Backbone, socket, BaseModel ) {

    /**
     * Scenic Model
     * Provides a way to sync models with Scenic using websockets
     *
     * @constructor
     * @extends BaseModel
     */
    var ScenicModel = BaseModel.extend( {

        /**
         * Initialize
         */
        initialize: function () {
            BaseModel.prototype.initialize.apply( this, arguments );

            // Main communication channel
            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            // Model Error Handler, goes directly into the vent
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
            'create': function() { return [ 'create', this.get( 'class' ), this.get( 'newName' ), socket.id ]; },
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
         * @param model
         * @param options
         * @returns {*}
         */
        sync: function ( method, model, options ) {
            var self = this;
            var command = this.methodMap[method];
            if ( command ) {
                var callback = function ( error, result ) {
                    if ( error ) {
                        return options.error( error );
                    }
                    if ( method == 'create') {
                        self.set('id', result.name);
                    }
                    options.success( result );
                };
                socket.emit.apply( socket, ( typeof command == 'function' ? command.apply( this ) : [command] ).concat( callback ) );
                model.trigger( 'request', model, socket, options );
            } else {
                return options.error( 'Invalid request' );
            }
        }
    } );

    return ScenicModel;
} );
