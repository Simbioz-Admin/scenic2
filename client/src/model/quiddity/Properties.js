"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/quiddity/Property'
], function ( _, Backbone, socket, ScenicCollection, Property ) {

    /**
     *  @constructor
     *  @augments ScenicCollection
     */
    var Properties = ScenicCollection.extend( {
        model:      Property,
        quiddity:   null,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function() { return [ 'get_properties_description', this.quiddity.id ] }
        },

        initialize: function() {
            ScenicCollection.prototype.initialize.apply(this,arguments);
        }
    } );
    return Properties;
} );
