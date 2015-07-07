"use strict";

define( [
    'underscore',
    'backbone',
    'model/Session'
], function ( _, Backbone, Session ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Collection
     */
    var Sessions = Backbone.Collection.extend( {
        model:        Session,

        initialize: function ( models, options ) {

        },

        /**
         * Get the current session
         *
         * @returns {Session}
         */
        getCurrentSession: function () {
            return this.findWhere({active:true});
        },

        /**
         * Set current Session
         *
         * @param {Session} session
         */
        setCurrentSession: function ( session ) {
            this.each( function ( s ) {
                s.set( 'active', false );
            } );
            session.set( 'active', true );
            this.trigger( 'change:current', session );
        }
    } );

    return Sessions;
} );
