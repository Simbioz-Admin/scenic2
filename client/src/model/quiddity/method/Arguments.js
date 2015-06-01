"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/BaseCollection',
    'model/quiddity/method/Argument'
], function ( _, Backbone, BaseCollection, Argument ) {

    /**
     * Method Arguments
     *
     * @constructor
     * @extends BaseCollection
     */
    var Arguments = BaseCollection.extend( {
        model: Argument
    } );

    return Arguments;
} );
