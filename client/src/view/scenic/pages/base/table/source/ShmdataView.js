"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/source/shmdata/ConnectionView',
    'text!template/scenic/pages/base/table/source/shmdata.html'
], function ( _, Backbone, Marionette, ConnectionView, ShmdataTemplate ) {

    /**
     * Shmdata View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var Shmdata = Marionette.CompositeView.extend( {
        template:           _.template( ShmdataTemplate ),
        className:          'shmdata',

        childView:          ConnectionView,
        childViewOptions: function() {
            return {
                shmdata: this.model,
                table: this.options.table
            }
        },

        childViewContainer: '.connections',

        modelEvents: {
            'change:byte-rate': 'updateByteRate'
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
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            if ( this.options.connectionView ) {
                this.childView = this.options.connectionView;
            }
        },

        /**
         * Render Handler
         */
        onRender: function() {
            // Check the byte rate to update status
            this.updateByteRate();
        },

        /**
         * Filter destinations in order to display connections for shmdata
         *
         * @param destination
         * @returns {boolean}
         */
        filter: function (destination) {
            // Get back up to the table model to filter the displayed connections
            return this.options.table.filterDestination( destination, true );
        },

        /**
         * Show Info
         * @param event
         */
        showInfo: function( event ) {
            this.scenicChannel.commands.execute( 'shmdata:info', this.model );
        },

        /**
         * Update byte rate
         */
        updateByteRate: function( ) {
            if ( this.model.get('byteRate') == 0 ) {
                this.$el.removeClass('active');
            } else {
                this.$el.addClass('active');
            }
        }
    } );

    return Shmdata;
} );
