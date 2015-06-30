"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel',
    'model/quiddity/method/Arguments'
], function ( _, Backbone, socket, ScenicModel, Arguments ) {

    /**
     * Quiddity Method
     *
     * @constructor
     * @extends ScenicModel
     */
    var Method = ScenicModel.extend( {
        defaults:  function () {
            return {
                'name':              null,
                'description':       null,
                'returnDescription': null,
                'returnType':        null,
                'order':             0,
                'args':              new Arguments()
            }
        },
        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function () {
                return ['quiddity.method.get', this.collection.quiddity.id, this.id]
            }
        },

        /**
         * Parse
         *
         * @param response
         * @returns {*}
         */
        parse: function ( response ) {
            //Parse arguments into a collection
            response.args = new Arguments( response.args );
            return response;
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply( this, arguments );

            this.get( 'args' ).method = this;

            // Only bind to socket if we aren't new
            // We don't want temporary models staying referenced by socket.io
            if ( !this.isNew() ) {
                this.onSocket( "quiddity.method.removed", _.bind( this._onMethodRemoved, this ) );
            }
        },

        /**
         * Method Removed Handler
         *
         * @param {string} quiddityId The name of the quiddity
         * @param {string} name The name of the property or method
         */
        _onMethodRemoved: function ( quiddityId, name ) {
            if ( this.collection.quiddity.id == quiddityId && this.id == name ) {
                this.get( 'args' ).destroy();
                this.trigger( 'destroy', this, this.collection );
            }
        },

        /**
         * Invoke method
         */
        invoke: function ( callback ) {
            var self = this;
            this.get('args' ).pluck('value');
            socket.emit( 'quiddity.method.invoke', this.collection.quiddity.id, this.id, this.get('args' ).pluck('value'), function( error, result ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger('error', error );
                    if ( callback ) {
                        return callback( error, result );
                    }
                }

                self.get('args' ).each( function( arg ) {
                    arg.set('value', '');
                });

                if ( callback ) {
                    callback( error, result );
                }
            } );
        }
    } );

    return Method;
} )
;