"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, ScenicModel ) {

    /**
     * SaveFile
     *
     * @constructor
     * @extends ScenicModel
     */

    var SaveFile = ScenicModel.extend( {
        idAttribute: 'uri',
        methodMap:  {
            'create': function() { return ['saveFile', this.get('name')]; },
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   null
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);
        },

        loadFile: function( callback ) {
            var self = this;
            self.scenicChannel.vent.trigger('file:loading', self.get('name') );
            socket.emit( 'loadFile', this.get('name'), function( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger('error', error );
                    return callback ? callback( error ) : null;
                }
                app.quiddities.fetch();
                self.scenicChannel.vent.trigger('file:loaded', self.get('name') );
                callback ? callback() : null;
            } );
        },

        saveFile: function( callback ) {
            var self = this;
            socket.emit( 'saveFile', this.get('name'), function( error ) {
                if ( error ) {
                    self.scenicChannel.vent.trigger('error', error );
                    return callback ? callback( error ) : null;
                }
                self.scenicChannel.vent.trigger('file:saved', self.get('name') );
                callback ? callback() : null;
            } );
        }
    } );
    return SaveFile;
} );