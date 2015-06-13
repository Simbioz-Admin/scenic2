"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicCollection',
    'model/ClassDescription'
], function ( _, Backbone, ScenicCollection, ClassDescription ) {

    /**
     * Class Description Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var ClassDescriptions = ScenicCollection.extend( {
        model:     ClassDescription,
        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'class.list'
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicCollection.prototype.initialize.apply( this, arguments );
        }
    } );

    return ClassDescriptions;
} );
