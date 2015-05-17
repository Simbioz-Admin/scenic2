"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/table/destination.html'
], function ( _, Backbone, Marionette, DestinationTemplate ) {

    /**
     * Destination View
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var Destination = Marionette.ItemView.extend( {
        template: _.template( DestinationTemplate ),
        className: 'quiddity destination',

        ui: {
            edit: '.actions .action.edit',
            remove: '.actions .action.remove'
        },

        events: {
            'click @ui.edit': 'editDestination',
            'click @ui.remove': 'removeDestination'
        },

        /**
         * Initialize
         */
        initialize: function( ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
        },

        /**
         * Edit Handler
         * @param event
         */
        editDestination: function( event ) {
            this.model.edit();
        },

        /**
         * Remove Handler
         * @param event
         */
        removeDestination: function( event ) {
            var self = this;
            this.scenicChannel.commands.execute( 'confirm', $.t('Are you sure you want to remove the __destinationName__ destination?', {destinationName:this.model.get('name')}), function( confirmed ) {
                if ( confirmed ) {
                    self.model.destroy();
                }
            });
        }
    } );

    return Destination;
} );
