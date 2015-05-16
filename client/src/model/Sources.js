"use strict";

define( [
    'underscore',
    'backbone',
    'model/Source'
], function ( _, Backbone, Source ) {

    /**
     * Sources Collection
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var Sources = Backbone.Collection.extend( {
        model: Source,

        /**
         * Initialize
         */
        initialize: function () {

        }
    } );

    return Sources;
} );
