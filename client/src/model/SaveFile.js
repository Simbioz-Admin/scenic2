"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicModel'
], function ( _, Backbone, ScenicModel ) {

    /**
     * SaveFile
     *
     * @constructor
     * @extends ScenicModel
     */

    var SaveFile = ScenicModel.extend( {
        idAttribute: 'name',
        methodMap:   {
            'create': function () {
                return ['file.save', this.get( 'name' )];
            },
            'update': function () {
                return ['file.save', this.get( 'name' )];
            },
            'patch':  function () {
                return ['file.save', this.get( 'name' )];
            },
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

            if ( !this.isNew() ) {
                // Handlers
                this.onSocket( 'file.loading', _.bind( this._onLoading, this ) );
                this.onSocket( 'file.loaded', _.bind( this._onLoaded, this ) );
                this.onSocket( 'file.load.error', _.bind( this._onLoadError, this ) );
                this.onSocket( 'file.deleted', _.bind( this._onDeleted, this ) );
            }
        },

        loadFile: function ( callback ) {
            var self = this;
            this.scenic.socket.emit( 'file.load', this.get( 'name' ), function ( error ) {
                if ( callback ) {
                    callback( error );
                }
            } );
        },

        /*saveFile: function ( callback ) {
            var self = this;
            this.scenic.socket.emit( 'file.save', this.get( 'name' ), function ( error ) {
                if ( error ) {
                    self.scenic.sessionChannel.vent.trigger( 'error', error );
                    return callback ? callback( error ) : null;
                }
                callback ? callback() : null;
            } );
        },*/

        _onLoading: function(file) {
            if ( this.id == file ) {
                this.scenic.sessionChannel.vent.trigger( 'file:loading', this );
            }
        },

        _onLoaded: function(file) {
            if ( this.id == file ) {
                // Refresh the quiddities after a reload
                var self = this;
                this.scenic.quiddities.reset();
                this.scenic.quiddities.fetch( {
                    success: function () {
                        self.scenic.sessionChannel.vent.trigger( 'file:loaded', self );
                    },
                    error:   function ( error ) {
                        self.scenic.sessionChannel.vent.trigger( 'error', error );
                    }
                } );
            }
        },

        _onLoadError: function(file) {
            if ( this.id == file ) {
                this.scenic.sessionChannel.vent.trigger( 'file:load:error', this );
            }
        },

        /**
         * Delete Handler
         * Destroy this file and its child collections if our id matches the one being removed
         *
         * @param {String} file - File name
         * @private
         */
        _onDeleted: function ( file ) {
            if ( this.id == file ) {
                // Broadcast first so that everyone has a change to identify
                this.scenic.sessionChannel.vent.trigger( 'file:removed', this );

                // Destroy ourselves
                this.trigger( 'destroy', this, this.collection );
            }
        }
    } );
    return SaveFile;
} );