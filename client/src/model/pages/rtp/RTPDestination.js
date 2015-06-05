"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'app',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, app, ScenicModel ) {

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
                return ['createRTPDestination', this.get('info').name, this.get('info').host, this.get('info').port];
            },
            'update': null,
            'patch':  null,
            'delete': function () {
                return ['removeRTPDestination', this.id];
            },
            'read':   null
        },

        mutators: {
            port: {
                transient: true,
                get: function() {
                    var ctrlClient = app.quiddities.get(app.config.soap.controlClientPrefix + this.id );
                    if ( !ctrlClient ) {
                        return null;
                    }
                    var url = ctrlClient.get('properties' ).get('url' ).get('value');
                    if ( !url ) {
                        return null;
                    }
                    return url.substr( url.lastIndexOf(':') + 1 );
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
                socket.emit( 'updateRTPDestination', self.id, info, function( error ) {
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
