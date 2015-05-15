"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/BaseCollection',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, BaseCollection, ScenicModel ) {

    /**
     *  @constructor
     *  @augments BaseModel
     */
    var ScenicCollection = BaseCollection.extend( {
        model:      ScenicModel,
        initialize: function () {
            BaseCollection.prototype.initialize.apply( this, arguments );
        },
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   null
        },
        sync:       function ( method, collection, options ) {
            var command = this.methodMap[method];
            if ( command ) {
                var callback = function( error, result ) {
                    if ( error ) {
                        return options.error( error );
                    }
                    options.success(result);
                };
                socket.emit.apply(socket, ( typeof command == 'function' ? command.apply(this) : [ command ] ).concat(callback) );
                collection.trigger( 'request', collection, socket, options );
            }
        }
    } );

    return ScenicCollection;
} );
