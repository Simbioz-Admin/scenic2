"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/table/source/shmdata/Connection',
    'text!template/scenic/table/source/shmdata.html'
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
         * Sources Connections for shmdata
         *
         * @param quiddity
         * @returns {boolean}
         */
        filter: function (quiddity) {
            // Get back up to the table model to filter the displayed connections
            return this.options.table.filterQuiddityOrClass( 'destination', quiddity );
        },

        /**
         * Show Info
         * @param event
         */
        showInfo: function( event ) {
            this.scenicChannel.commands.execute( 'shmdata:info', this.model );
        },

        updateByteRate: function( model, value ) {
            if ( value == 0 ) {
                this.$el.removeClass('active');
            } else {
                this.$el.addClass('active');
            }
        }
    } );

    return Shmdata;
} );
