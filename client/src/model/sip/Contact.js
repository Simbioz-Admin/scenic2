"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, ScenicModel ) {

    /**
     * SIP Contact
     *
     * @constructor
     * @extends ScenicModel
     */

    var Contact = ScenicModel.extend( {

        defaults: {
            status: 'offline',
            status_text: '',
            subscription_state: '',
            uri: null,
            send_status: null,
            recv_status: null,
            name: null,
            self: false
        },

        methodMap:   {
            'create': function () {
                return ['addContact', this.get( 'uri' )];
            },
            'update':function () {
                return ['updateContact', this.get( 'uri' ), { name: this.get('name') }];
            },
            'patch':  null,
            'delete': function() {
                return ['removeContact', this.get('uri')];
            },
            'read':   null
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);

            // Handlers
            this.onSocket( 'removeUser', _.bind( this._onRemoved, this ) );
        },

        /**
         * Delete Handler
         *
         * @param {String} uri
         * @private
         */
        _onRemoved: function ( uri ) {
            if ( this.id == uri ) {
                this.trigger( 'destroy', this, this.collection );
            }
        },

        /**
         * Call Contact
         */
        call: function(cb) {
            var self = this;
            socket.emit('callContact', this.id, function( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger('error', error);
                    if ( cb ) {
                        return cb(error);
                    }
                }
                if ( cb ) {
                    cb();
                }
            });
        },

        /**
         * Hang Up Contact
         */
        hangUp: function(cb) {
            var self = this;
            socket.emit('hangUpContact', this.id, function( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger('error', error);
                    if ( cb ) {
                        return cb(error);
                    }
                }
                if ( cb ) {
                    cb();
                }
            });
        },

        /**
         *  Edit Contact
         */
        edit: function () {
            var self = this;
            this.scenicChannel.commands.execute( 'contact:edit', this, function( info ) {
                socket.emit( 'updateContact', self.id, info, function( error ) {
                    if ( error ) {
                        self.scenicChannel.vent.trigger( 'error', error );
                        return;
                    }
                } )
            } );
        }
    } );
    return Contact;
} );