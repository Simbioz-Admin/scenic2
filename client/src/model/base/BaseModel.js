"use strict";

define( [
    'underscore',
    'backbone'
], function ( _, Backbone ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Model
     */
    var BaseModel = Backbone.Model.extend( {
        initialize: function () {
            Backbone.Model.prototype.initialize.apply(this, arguments);
        }
    } );

    return BaseModel;
} );
