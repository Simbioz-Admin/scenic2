"use strict";

define( [
    // Lib
    'underscore',
    'backbone',
    'marionette',
    'view/SessionsView',
    'view/ScenicView',
    'text!template/application.html'
], function ( _, Backbone, Marionette, SessionsView, ScenicView, ApplicationTemplate ) {

    /**
     * @constructor
     * @augments module:Marionette.LayoutView
     */
    var ApplicationView = Marionette.LayoutView.extend( {
        template: _.template( ApplicationTemplate ),
        el:       '#scenic',

        ui: {
            modal: '#modal'
        },

        regions: {
            sessions: '#sessions',
            session:   '#session'
        },

        initialize: function ( options ) {
            this.sessions = options.sessions;
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.sessions.on( 'change:current', _.bind( this.showSession, this ) );
        },

        /**
         * Render
         * Special case for the moment as we don't use a master application view to render us
         */
        onRender: function () {
            this.showChildView( 'sessions', new SessionsView( {collection: this.sessions} ) );
            this.showSession( this.sessions.getCurrentSession() );
            this.$el.fadeIn( 500 );
        },

        /**
         * Current session change handler
         * Displays the current session
         *
         * @param {Scenic} session
         * @private
         */
        showSession: function ( session ) {
            if ( this.currentSession ) {
                this.$el.removeClass( this.currentSession.id );
            }
            if ( session ) {
                this.showChildView( 'session', new ScenicView( session.scenic ) );
                this.currentSession = session;
            } else {
                this.getRegion( 'session' ).empty();
                this.currentSession = null;
            }
            if ( this.currentSession ) {
                this.$el.addClass( this.currentSession.id );
            }
        }

    } );

    return ApplicationView;
} );
