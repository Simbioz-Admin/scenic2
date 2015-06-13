"use strict";

define( [
    // Lib
    'underscore',
    'backbone',
    'marionette',
    'view/application/SessionsView',
    'view/ScenicView',
    'view/scenic/modal/Confirmation',
    'text!template/application.html'
], function ( _, Backbone, Marionette, SessionsView, ScenicView, ConfirmationView, ApplicationTemplate ) {

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
            session:   '#session',
            modal:     '#modal'
        },

        initialize: function ( options ) {
            this.sessions = options.sessions;
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.sessions.on( 'change:current', _.bind( this.showSession, this ) );

            // Wreqr Handlers
            this.scenicChannel.commands.setHandler( 'confirm', this._onConfirm, this );
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
        },

        //  ███╗   ███╗ ██████╗ ██████╗  █████╗ ██╗
        //  ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║
        //  ██╔████╔██║██║   ██║██║  ██║███████║██║
        //  ██║╚██╔╝██║██║   ██║██║  ██║██╔══██║██║
        //  ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║  ██║███████╗
        //  ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝

        /**
         * Confirmation Handler
         * Shows a modal to confirm an action
         *
         * @param message
         * @param callback
         * @private
         */
        _onConfirm: function ( message, callback ) {
            if ( !callback ) {
                callback = message;
                message  = i18n.t( 'Are you sure?' );
            }
            this.$el.addClass( 'blur' );
            this.ui.modal.css( 'opacity', 1 );
            this.showChildView( 'modal', new ConfirmationView( {
                message:  message,
                callback: _.bind( this.closeModal, this, callback )
            } ) );
        },

        /**
         * Close Modal
         *
         * @param callback
         * @param result
         */
        closeModal: function ( callback, result ) {
            this.$el.removeClass( 'blur' );
            this.ui.modal.css( 'opacity', 0 );
            callback( result );
            var self = this;
            setTimeout( function () {
                self.getRegion( 'modal' ).empty();
            }, 500 );
        },

    } );

    return ApplicationView;
} );
