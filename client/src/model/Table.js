"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket'
], function ( _, Backbone, socket ) {

    /**
     * Table
     *
     * @constructor
     * @extends module:Backbone.Model
     */
    var Table = Backbone.Model.extend( {
        defaults: function () {
            return {
                "name":         null,
                "type":         null,
                "description":  null,
                "menus":        [],
                "active":       false
            }
        },

        /**
         * Initialize
         */
        initialize: function () {
            // Main communication channel
            // We cheat the system a little bit here, but we want our errors to bubble back to the UI
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );


            // Setup child collections
            // TODO: Setup colections with data respecting the source/destination include/exclude policies
            //this.get( 'sources' ).add( this.getQuidds( 'sources' ), {merge: true} );
            //this.get( 'destinations' ).add( this.getQuidds( 'destinations' ), {merge: true} );
            //TODO: When a source or destination is added, check if it is for a source/destination in the current table
        },

        /**
         * Activate a table
         */
        activate: function () {
            this.collection.setCurrentTable( this );
        },

        /**
         * Filter Quiddity for access from this table
         *
         * @param type
         * @param quiddity
         * @returns {boolean}
         */
        filterQuiddityOrClass: function ( type, quiddity ) {
            var className = quiddity.has( 'class name' ) ? quiddity.get( 'class name' ) : quiddity.get( 'class' );
            var category  = quiddity.get( 'category' );
            var included  = this.has( type ) && this.get( type ).include ? _.some( this.get( type ).include, function ( include ) {
                return category.indexOf( include ) != -1 || className.indexOf( include ) != -1;
            } ) : true;
            var excluded  = this.has( type ) && this.get( type ).exclude ? _.contains( this.get( type ).exclude, category ) : false;
            return included && !excluded;
        },

        /**
         * Check if a shmdata can connect to a destination
         *
         * @param shmdata
         * @param destination
         * @param callback
         */
        canConnect: function( shmdata, destination, callback ) {
            if ( this.get('type') == 'sink' ) {
                socket.emit( 'invokeMethod', destination.id, 'can-sink-caps', [shmdata.get( 'caps' )], function ( error, canSink ) {
                    if ( error ) {
                        console.error( error );
                        callback( false );
                    }
                    callback( canSink == 'true' );
                } );
            }
        },

        connect: function( shmdata, destination ) {
            var self = this;
            if ( this.get('type') == 'sink' ) {
                //TODO: Move into destination quiddity
                var existingConnectionCount = destination.get('shmdatas').where({type:'reader'});
                var maxReaders = destination.get('maxReaders');
                if (maxReaders > existingConnectionCount || maxReaders == 0) {
                    socket.emit('invokeMethod', destination.id, 'connect', [shmdata.id], function(error, result) {
                        if ( error ) {
                            console.error( error );
                        }
                    });
                } else {
                    if (maxReaders == 1) {
                        socket.emit('invokeMethod', destination.id, 'disconnect-all', [], function(error, result) {
                            if ( error ) {
                                console.error( error );
                            }
                            socket.emit('invokeMethod', destination.id, 'connect', [shmdata.id], function(error, result) {
                                if ( error ) {
                                    console.error( error );
                                }
                            });
                        });
                    } else {
                        self.scenicChannel.vent.trigger('error', $.t('You have reached the maximum number of connections. The limit is __limit__', { limit: maxReaders }));
                    }
                }
            }
        },

        disconnect: function( shmdata, destination ) {
            if ( this.get('type') == 'sink' ) {
                //TODO: Move into destination quiddity
                socket.emit( 'invokeMethod', destination.id, 'disconnect', [shmdata.id], function ( error, data ) {
                    if ( error ) {
                        log.error( error );
                    }
                } );
            }
        }
    } );

    return Table;
} );
