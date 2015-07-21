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
        model: Argument,

        /**
         * Initialize
         */
        initialize: function (models, options) {
            BaseCollection.prototype.initialize.apply( this, arguments );
            this.scenic = options.scenic;
            this.method = options.method;
        }
    } );

    return Arguments;
} );
