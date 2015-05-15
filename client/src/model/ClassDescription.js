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

        deviceAutoDetectList: ["v4l2src", "pulsesrc", "midisrc"],
        autoDetectDevices: false,

        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);
            this.autoDetectDevices = _.contains( this.deviceAutoDetectList, this.get('class name'));
        },

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
                console.log( property );
                return callback ? callback( null, property ) : null;
            } );
        }
    } );
    return ClassDescription;
} );