"use strict";

define( [
    'underscore',
    'backbone',
    'app',
    'model/base/ScenicModel'
], function ( _, Backbone, app, ScenicModel ) {

    /**
     * RTP Destination
     *
     * @constructor
     * @extends ScenicModel
     */
    var RTPDestination = ScenicModel.extend( {
        idAttribute: 'name',

        /**
         * Method map
         * Maps Backbone sync methods to our socket methods
         * Supports either strings of functions returning arrays of arguments
         * Can be overridden in sub classes
         */
        methodMap: {
            'create': function () {
                return ['rtp.destination.create', this.get('info').name, this.get('info').host, this.get('info').port];
            },
            'update': null,
            'patch':  null,
            'delete': function () {
                return ['rtp.destination.remove', this.id];
            },
            'read':   null
        },

        mutators: {
            port: {
                transient: true,
                get:       function () {
                    var ctrlClient = this.scenic.quiddities.get( this.scenic.config.soap.controlClientPrefix + this.id );
                    if ( !ctrlClient ) {
                        return null;
                    }
                    var url = ctrlClient.properties.get( 'url' ) ? ctrlClient.properties.get( 'url' ).get( 'value' ) : null;
                    if ( !url ) {
                        return null;
                    }
                    return url.substr( url.lastIndexOf( ':' ) + 1 );
                }
            }
        },

        /**
         *  Edit Quiddity
         *  Put the quiddity in edit mode by updating its properties and descriptions,
         *  then subscribing to get real-time updates
         */
        edit: function () {
            var self = this;
            this.scenicChannel.commands.execute( 'rtp:edit', this, function( info ) {
                self.scenic.socket.emit( 'rtp.destination.update', self.id, info, function( error ) {
                    if ( error ) {
                        self.scenicChannel.vent.trigger( 'error', error );
                        return;
                    }
                } )
            } );
        }
    } );

    return RTPDestination;
} );
