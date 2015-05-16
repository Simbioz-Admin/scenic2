"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, ScenicModel ) {

    /**
     * Class Description Collection
     *
     * @constructor
     * @extends ScenicModel
     */

    var ClassDescription = ScenicModel.extend( {
        idAttribute: 'class name',
        defaults: {
            'class name': null,
            'long name': null,
            'short description': null,
            'category': null,
            'author': null,
            'license': null,
            // Dynamic
            'devices': []
        },

        /**
         * Quiddities for which we'll autodetect devices
         */
        deviceAutoDetectList: ["v4l2src", "pulsesrc", "midisrc"],

        /**
         * Device auto-detect flag
         */
        autoDetectDevices: false,

        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);

            // Setup device-autodetect
            this.autoDetectDevices = _.contains( this.deviceAutoDetectList, this.get('class name'));
        },

        /**
         * Load devices for quiddity
         *
         * @param callback
         * @returns {*}
         */
        loadDevices: function( callback ) {
            if ( !this.autoDetectDevices ) {
                return callback ? callback() : null;
            }
            socket.emit( 'get_property_by_class', this.id, 'device', function ( error, property ) {
                if ( error ) {
                    console.error( error );
                    return callback ? callback( error ) : null;
                }
                //TODO: Parse devices
                console.info( '>>> WHAT SHOULD I DO WITH THIS ROPERTY? >>>', property );
                return callback ? callback( null, property ) : null;
            } );
        }
    } );

    return ClassDescription;
} );