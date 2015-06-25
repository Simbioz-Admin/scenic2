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

        defaults: {
            quiddity: null,
            property: null
        },

        methodMap: {
            'delete': function () {
                return ['control.mapping.remove.destination', this.get( 'quiddity' ).id, this.get('property' ).id];
            }
        }

    } );

    return ControlDestination;
} );
