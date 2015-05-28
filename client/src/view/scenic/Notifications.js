'use strict';

define( [
    'underscore',
    'backbone',
    'toastr'
], function ( _, Backbone, toastr ) {

    /**
     *  @constructor
     *  @augments module:Backbone.View
     */
    var NotificationsView = Backbone.View.extend( {
        el:       '#scenic',

        initialize: function ( app ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            // Wreqr Handlers
            this.scenicChannel.vent.on( 'info', this._onInfo, this );
            this.scenicChannel.vent.on( 'success', this._onSuccess, this );
            this.scenicChannel.vent.on( 'error', this._onError, this );

            toastr.options = {
                'closeButton': true,
                'debug': false,
                'newestOnTop': false,
                'progressBar': false,
                'positionClass': 'toast-bottom-right',
                'preventDuplicates': false,
                'onclick': null,
                'showDuration': '250',
                'hideDuration': '500',
                'timeOut': '3000',
                'extendedTimeOut': '1000',
                'showEasing': 'linear',
                'hideEasing': 'linear',
                'showMethod': 'fadeIn',
                'hideMethod': 'fadeOut'
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
            toastr.info(message);
        },

        /**
         * Success Handler
         * Displays a notification
         *
         * @param message
         * @private
         */
        _onSuccess: function ( message ) {
            toastr.success(message);
        },

        /**
         * Error Handler
         * Displays a notification
         *
         * @param message
         * @private
         */
        _onError: function ( message ) {
            toastr.error(message);
        }
    } );

    return NotificationsView;
} );
