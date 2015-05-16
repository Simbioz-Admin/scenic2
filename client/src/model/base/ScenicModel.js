"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/BaseModel'
], function ( _, Backbone, socket, BaseModel ) {

    /**
     *  @constructor
     *  @augments BaseModel
     */
    var ScenicModel = BaseModel.extend( {

        initialize: function () {
            BaseModel.prototype.initialize.apply( this, arguments );

            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            // Error Handler
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
            'delete': 'remove',
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
            switch ( method ) {
                case 'create':
                    socket.emit( 'create', this.get( 'class' ), this.get( 'newName' ), socket.id, function ( error, info ) {
                        if ( error ) {
                            return options.error( error );
                        }
                        self.set( 'id', info.name );
                        options.success( info );
                    } );
                    break;

                default:
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
                        return options.error( 'Invalid request' );
                    }
                    break;
            }
        }
    } );

    return ScenicModel;
} );
