"use strict";

define( [
    'underscore',
    'backbone',
    'model/quiddity/method/Argument'
], function ( _, Backbone, Argument ) {

    /**
     * Method Arguments
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var Arguments = Backbone.Collection.extend( {
        model: Argument,
        defaults: {
            'name': null,
            'long name': null,
            'description': null,
            'type': null
        }
    } );

    return Arguments;
} );
