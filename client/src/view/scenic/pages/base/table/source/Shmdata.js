"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/source/shmdata/Connection',
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
            'change:byteRate': 'updateByteRate'
        },

        ui: {
            info: '.actions .action.info'
        },

        events: {
            'click @ui.info': 'showInfo'
        },

        /**
         * Initialize
         */
        initialize: function (  ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
        },

        /**
         * Render Handler
         */
        onRender: function() {
            // Check the byte rate to update status
            this.updateByteRate();
        },

        /**
         * Sources Connections for shmdata
         *
         * @param quiddity
         * @returns {boolean}
         */
        filter: function (quiddity) {
            // Get back up to the table model to filter the displayed connections
            return this.options.table.filterDestination( quiddity, true );
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
