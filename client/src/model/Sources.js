"use strict";

define( [
    'underscore',
    'backbone',
    'model/Source'
], function ( _, Backbone, Source ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Collection
     */
    var Sources = Backbone.Collection.extend( {
        model:        Source,
    } );
    return Sources;
} );
