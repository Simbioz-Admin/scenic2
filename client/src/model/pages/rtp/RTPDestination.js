"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicModel'
], function ( _, Backbone, ScenicModel ) {

    /**
     * RTP Destination
     *
     * @constructor
     * @extends ScenicModel
     */
    var RTPDestination = ScenicModel.extend( {
        idAttribute: 'name',

        /**
         * Method map
         * Maps Backbone sync methods to our socket methods
         * Supports either strings of functions returning arrays of arguments
         * Can be overridden in sub classes
         */
        methodMap: {
            'create': function () {
                return ['createRTPDestination' /* TODO */];
            },
            'update': null,
            'patch':  null,
            'delete': function () {
                return ['removeRTPDestination', this.id];
            },
            'read':   null
        }
    } );

    return RTPDestination;
} );
