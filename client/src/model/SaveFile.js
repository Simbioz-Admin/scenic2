"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'app',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, app, ScenicModel ) {

    /**
     * SaveFile
     *
     * @constructor
     * @extends ScenicModel
     */

    var SaveFile = ScenicModel.extend( {
        idAttribute: 'uri',
        methodMap:   {
            'create': function () {
                return ['file.save', this.get( 'name' )];
            },
            'update': null,
            'patch':  null,
            'delete': function () {
                return ['file.delete', this.get( 'name' )];
            },
            'read':   null
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply( this, arguments );
        },

        loadFile: function ( callback ) {
            var self = this;
            self.scenicChannel.vent.trigger( 'file:loading', self.get( 'name' ) );
            socket.emit( 'file.load', this.get( 'name' ), function ( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger( 'file:error error', error );
                    return callback ? callback( error ) : null;
                }
                // Refresh the quiddities after a reload
                app.quiddities.reset();
                app.quiddities.fetch( {
                    success: function () {
                        self.scenicChannel.vent.trigger( 'file:loaded', self.get( 'name' ) );
                        callback ? callback() : null;
                    },
                    error:   function ( error ) {
                        self.scenicChannel.vent.trigger( 'file:error error', error );
                        callback ? callback( error ) : null;
                    }
                } );
            } );
        },

        saveFile: function ( callback ) {
            var self = this;
            socket.emit( 'file.save', this.get( 'name' ), function ( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger( 'file:error error', error );
                    return callback ? callback( error ) : null;
                }
                self.scenicChannel.vent.trigger( 'file:saved', self.get( 'name' ) );
                callback ? callback() : null;
            } );
        }
    } );
    return SaveFile;
} );