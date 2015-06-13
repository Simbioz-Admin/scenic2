"use strict";

define( [
    'underscore',
    'backbone',
    'app'
], function ( _, Backbone, Scenic ) {

    /**
     * Session
     *
     * @constructor
     * @extends module:Backbone.Model
     */

    var Session = Backbone.Model.extend( {

        idAttribute: 'host',

        defaults: {
            id:          null,
            name:        null,
            host:        null
        },

        /**
         * Initialize
         */
        initialize: function ( attributes, options ) {
            this.set('name', this.get('host') ? this.get('host') : 'default' );
            this.scenic = new Scenic( this.get('lang'), this.get('host') );
        },

        /**
         * Activate a session
         */
        activate: function () {
            this.collection.setCurrentSession( this );
        }
    } );

    return Session;
} );