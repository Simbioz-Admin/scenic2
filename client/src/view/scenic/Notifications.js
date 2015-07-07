'use strict';

define( [
    'underscore',
    'backbone',
    'i18n',
    'toastr'
], function ( _, Backbone, i18n, toastr ) {

    /**
     *  @constructor
     *  @augments module:Backbone.View
     */
    var NotificationsView = Backbone.View.extend( {
        el: '.session',

        initialize: function ( options ) {
            this.scenic = options.scenic;
            this.scenic.sessionChannel.vent.on( 'info', this._onInfo, this );
            this.scenic.sessionChannel.vent.on( 'success', this._onSuccess, this );
            this.scenic.sessionChannel.vent.on( 'error', this._onError, this );

            toastr.options = {
                'closeButton':       true,
                'debug':             false,
                'newestOnTop':       false,
                'progressBar':       false,
                'positionClass':     'toast-bottom-right',
                'preventDuplicates': false,
                'onclick':           null,
                'showDuration':      '250',
                'hideDuration':      '500',
                'timeOut':           '3000',
                'extendedTimeOut':   '1000',
                'showEasing':        'linear',
                'hideEasing':        'linear',
                'showMethod':        'fadeIn',
                'hideMethod':        'fadeOut'
            }
        },

        /**
         * Notification Handler
         * Displays a notification
         *
         * @param message
         * @private
         */
        _onInfo: function ( message ) {
            toastr.info( message );
        },

        /**
         * Success Handler
         * Displays a notification
         *
         * @param message
         * @private
         */
        _onSuccess: function ( message ) {
            toastr.success( message );
        },

        /**
         * Error Handler
         * Displays a notification
         *
         * @param message
         * @private
         */
        _onError: function ( message ) {
            toastr.error( message, i18n.t( 'Error' ), { timeOut: 5000 } );
        }
    } );

    return NotificationsView;
} );
