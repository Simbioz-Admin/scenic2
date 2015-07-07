"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/ConnectionView',
    'text!template/scenic/pages/base/table/source/sourceChild.html'
], function ( _, Backbone, Marionette, ConnectionView, SourceChildTemplate ) {

    /**
     * Source Child View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var SourceChildView = Marionette.CompositeView.extend( {
        template:           _.template( SourceChildTemplate ),

        className: 'source-child',

        childView:          ConnectionView,

        childViewOptions: function() {
            return {
                scenic: this.scenic,
                source: this.model,
                table: this.options.table
            }
        },

        childViewContainer: '.connections',

        /**
         * Initialize
         */
        initialize: function ( options ) {
            this.scenic = options.scenic;
            if ( this.options.connectionView ) {
                this.childView = this.options.connectionView;
            }
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

    return SourceChildView;
} );
