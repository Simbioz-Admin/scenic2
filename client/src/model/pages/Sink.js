"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'i18n',
    'model/pages/base/Table'
], function ( _, Backbone, socket, i18n, Table ) {

    /**
     * Sink Table
     *
     * @constructor
     * @extends Table
     */

    var Sink = Table.extend( {

        defaults: function () {
            return {
                id:          "sink",
                name:        i18n.t( 'Sink' ),
                type:        'sink',
                description: i18n.t( "Manage audio/video devices and connections" )
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            Table.prototype.initialize.apply( this, arguments );
        },

        /**
         * @inheritdoc
         */
        canConnect: function ( shmdata, destination, callback ) {
            socket.emit( 'quiddity.method.invoke', destination.id, 'can-sink-caps', [shmdata.get( 'caps' )], function ( error, canSink ) {
                if ( error ) {
                    console.error( error );
                    callback( false );
                }
                callback( canSink );
            } );
        },

        /**
         * Connect a shmdata to a destination
         *
         * @param shmdata
         * @param destination
         */
        connect: function ( shmdata, destination ) {
            var self = this;
            //TODO: Move into destination quiddity?
            var existingConnectionCount = destination.get( 'shmdatas' ).where( {type: 'reader'} ).length;
            var maxReaders              = destination.get( 'maxReaders' );
            if ( maxReaders > existingConnectionCount || maxReaders == 0 ) {
                socket.emit( 'quiddity.method.invoke', destination.id, 'connect', [shmdata.get('path')], function ( error, result ) {
                    if ( error ) {
                        console.error( error );
                        self.scenicChannel.vent.trigger( 'error', error );
                    }
                } );
            } else {
                if ( maxReaders == 1 ) {
                    socket.emit( 'quiddity.method.invoke', destination.id, 'disconnect-all', [], function ( error, result ) {
                        if ( error ) {
                            console.error( error );
                        }
                        socket.emit( 'quiddity.method.invoke', destination.id, 'connect', [shmdata.get('path')], function ( error, result ) {
                            if ( error ) {
                                console.error( error );
                            }
                        } );
                    } );
                } else {
                    self.scenicChannel.vent.trigger( 'error', i18n.t( 'You have reached the maximum number of connections. The limit is __limit__', {limit: maxReaders} ) );
                }
            }
        },

        /**
         * Disconnect a shmdata from a destination
         *
         * @param shmdata
         * @param destination
         */
        disconnect: function ( shmdata, destination ) {
            //TODO: Move into destination quiddity
            socket.emit( 'quiddity.method.invoke', destination.id, 'disconnect', [shmdata.get('path')], function ( error, data ) {
                if ( error ) {
                    log.error( error );
                }
            } );
        }
    } );

    return Sink;
} );