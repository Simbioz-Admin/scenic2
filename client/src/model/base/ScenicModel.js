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
        },
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': 'remove',
            'read':   null
        },
        sync:       function ( method, model, options ) {
            var self = this;
            switch( method ) {
                case 'create':
                    socket.emit( 'create', this.get('class'), this.get('newName'), socket.id, function( error, info ) {
                        if ( error ) {
                            console.error( error );
                            return options.error( error );
                        }
                        self.set('id', info.name );
                        options.success( info );
                    } );
                    break;

                default:
                    var command = this.methodMap[method];
                    if ( command ) {
                        //TODO: Add callback support to every method
                        socket.emit( command, this.id );
                        //TODO: Check for errors
                        options.success();
                    } else {
                        return options.error('Invalid request.');
                    }
                    break;
            }

            model.trigger('request', model, socket, options);
        }
    } );

    return ScenicModel;
} );
