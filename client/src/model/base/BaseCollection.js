"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/BaseModel'
], function ( _, Backbone, BaseModel ) {

    /**
     * Base Collection
     * In case we need to extend Backbone.Collection
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var BaseCollection = Backbone.Collection.extend( {
        model: BaseModel,

        /**
         * Initialize
         */
        initialize: function () {
            Backbone.Collection.prototype.initialize.apply( this, arguments );
        }
    } );

    return BaseCollection;
} );
