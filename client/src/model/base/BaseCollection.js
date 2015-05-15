"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/BaseModel'
], function ( _, Backbone, BaseModel ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Collection
     */
    var BaseCollection = Backbone.Collection.extend( {
        model: BaseModel,
        initialize: function () {
            Backbone.Collection.prototype.initialize.apply(this, arguments);
        }
    } );

    return BaseCollection;
} );
