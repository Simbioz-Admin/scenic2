"use strict";

define( [
    'underscore',
    'backbone',
    'app'
], function ( _, Backbone, Scenic ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Collection
     */
    var Sessions = Backbone.Collection.extend( {
        model:        Scenic,

        initialize: function ( models, options ) {

        },

        /**
         * Get the current session
         *
         * @returns {Scenic}
         */
        getCurrentSession: function () {
            return this.findWhere({active:true});
        },

        /**
         * Set current Session
         *
         * @param {Scenic} session
         */
        setCurrentSession: function ( scenic ) {
            this.each( function ( s ) {
                s.set( 'active', false );
            } );
            scenic.set( 'active', true );
            this.trigger( 'change:current', scenic );
        }
    } );

    return Sessions;
} );
