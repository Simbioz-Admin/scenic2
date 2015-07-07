"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/source/SourceChildView'
], function ( _, Backbone, Marionette, SourceChildView ) {

    /**
     * Shmdata View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var ShmdataView = SourceChildView.extend( {
        className: SourceChildView.prototype.className + ' shmdata',

        modelEvents: {
            'change:byte_rate': 'updateByteRate'
        },

        ui: {
            info: '.actions .action.more'
        },

        events: {
            'click @ui.info': 'showInfo'
        },

        /**
         * Initialize
         */
        initialize: function ( options ) {
            SourceChildView.prototype.initialize.apply(this, arguments);
        },

        /**
         * Render Handler
         */
        onRender: function() {
            // Check the byte rate to update status
            this.updateByteRate();
        },

        /**
         * Show Info
         * @param event
         */
        showInfo: function( event ) {
            this.scenic.sessionChannel.commands.execute( 'shmdata:info', this.model );
        },

        /**
         * Update byte rate
         */
        updateByteRate: function( ) {
            if ( this.model.get('byte_rate') == 0 ) {
                this.$el.removeClass('active');
            } else {
                this.$el.addClass('active');
            }
        }
    } );

    return ShmdataView;
} );
