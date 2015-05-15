"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, ScenicModel ) {

    /**
     *  @constructor
     *  @augments ScenicModel
     */

    var Contact = ScenicModel.extend( {
        idAttribute: 'uri',
        defaults: {

        },

        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);
            socket.on( 'removeUser', _.bind( this._onRemoved, this ) );
        },

        /**
         * Delete Handler
         *
         * @param {String} uri
         */
        _onRemoved: function ( uri ) {
            if ( this.id == uri ) {
                this.trigger( 'destroy', this, this.collection );
            }
        }
    } );
    return Contact;
} );