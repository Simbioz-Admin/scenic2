"use strict";

define( [
    'underscore',
    'backbone'
], function ( _, Backbone ) {

    /**
     * Base Model
     * In case we need to extend Backbone.Model
     *
     * @constructor
     * @extends module:Backbone.Model
     */
    var BaseModel = Backbone.Model.extend( {
        initialize: function () {
            Backbone.Model.prototype.initialize.apply(this, arguments);
        }
    } );

    return BaseModel;
} );
