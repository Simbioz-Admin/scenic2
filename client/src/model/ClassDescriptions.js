"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/ClassDescription'
], function ( _, Backbone, socket, ScenicCollection, ClassDescription ) {

    /**
     *  @constructor
     *  @augments ScenicCollection
     */
    var ClassDescriptions = ScenicCollection.extend( {
        model:      ClassDescription,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'get_classes_doc'
        },

        initialize: function() {
            ScenicCollection.prototype.initialize.apply(this,arguments);
        }
    } );
    return ClassDescriptions;
} );
