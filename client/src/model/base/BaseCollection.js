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
        },

        /**
         * Destroys the collection, and child models
         */
        destroy: function() {
            var model;
            while( model = this.first() ) {
                model.trigger( 'destroy', model, this );
            }
        }
    } );

    return BaseCollection;
} );
