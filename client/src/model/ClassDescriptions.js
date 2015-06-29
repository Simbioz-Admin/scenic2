"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/ClassDescription'
], function ( _, Backbone, socket, ScenicCollection, ClassDescription ) {

    /**
     * Class Description Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var ClassDescriptions = ScenicCollection.extend( {
        model:     ClassDescription,
        comparator: function( classDescription ) {
            return classDescription.get('category') + '.' + classDescription.get('class');
        },

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
