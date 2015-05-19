"use strict";

define( [
    'underscore',
    'backbone',
    'model/quiddity/Property'
], function ( _, Backbone, Property ) {

    /**
     * Control Properties
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var ControlProperties = Backbone.Collection.extend( {
        model: Property
    } );

    return ControlProperties;
} );
