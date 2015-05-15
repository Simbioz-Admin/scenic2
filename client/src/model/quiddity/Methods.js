"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/quiddity/Method'
], function ( _, Backbone, socket, ScenicCollection, Method ) {

    /**
     *  @constructor
     *  @augments ScenicCollection
     */
    var Methods = ScenicCollection.extend( {
        model:      Method,
        quiddity:   null,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function() { return [ 'get_methods_description', this.quiddity.id ] }
        },

        initialize: function() {
            ScenicCollection.prototype.initialize.apply(this,arguments);
        }
    } );
    return Methods;
} );
