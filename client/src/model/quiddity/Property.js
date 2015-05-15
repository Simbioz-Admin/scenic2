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

    var Property = ScenicModel.extend( {
        idAttribute: 'name',
        defaults: {
            'type': null,
            'writable': null,
            'name': null,
            'long name': null,
            'short description': null,
            'default value': null,
            'position category': null,
            'position weight': 0
        },
        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);
        }
    } );
    return Property;
} );