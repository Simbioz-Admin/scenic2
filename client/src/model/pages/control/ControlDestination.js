"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicModel'
], function ( _, Backbone, ScenicModel ) {

    /**
     * Control Destination
     *
     * @constructor
     * @extends ScenicModel
     */
    var ControlDestination = ScenicModel.extend( {
        idAttribute: 'name',

        /**
         * Method map
         * Maps Backbone sync methods to our socket methods
         * Supports either strings of functions returning arrays of arguments
         * Can be overridden in sub classes
         */
        methodMap: {
            'create': function () {
                return ['__TODO__' /* TODO */];
            },
            'update': null,
            'patch':  null,
            'delete': function () {
                return ['__TODO__', this.id];
            },
            'read':   null
        }
    } );

    return ControlDestination;
} );
