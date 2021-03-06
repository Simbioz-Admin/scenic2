"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicModel'
], function ( _, Backbone, ScenicModel ) {

    /**
     * Class Description Collection
     *
     * @constructor
     * @extends ScenicModel
     */

    var ClassDescription = ScenicModel.extend( {

        idAttribute: 'class',

        defaults: {
            'class': null,
            'name': null,
            'description': null,
            'category': null,
            'author': null,
            'license': null,
            'tags': [],
            // Dynamic
            'devices': []
        },

        /**
         * Quiddities for which we'll autodetect devices
         * TODO: Do this server-side
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
            //TODO: Do this server-side
            this.autoDetectDevices = _.contains( this.deviceAutoDetectList, this.get('class'));
        },

        /**
         * Load devices for quiddity
         *
         * TODO: Do this server-side
         *
         * @param callback
         * @returns {*}
         */
        loadDevices: function( callback ) {
            if ( !this.autoDetectDevices ) {
                return callback ? callback() : null;
            }
            this.scenic.socket.emit( 'get_property_by_class', this.id, 'device', function ( error, property ) {
                if ( error ) {
                    console.error( error );
                    return callback ? callback( error ) : null;
                }
                //TODO: Parse devices
                console.info( '>>> WHAT SHOULD I DO WITH THIS PROPERTY? >>>', property );
                return callback ? callback( null, property ) : null;
            } );
        }
    } );

    return ClassDescription;
} );