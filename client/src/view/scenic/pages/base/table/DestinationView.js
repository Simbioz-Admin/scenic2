"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'text!template/scenic/pages/base/table/destination.html'
], function ( _, Backbone, Marionette, i18n, DestinationTemplate ) {

    /**
     * Destination View
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var Destination = Marionette.ItemView.extend( {
        template: _.template( DestinationTemplate ),
        templateHelpers: function() {
            return {
                classDescription: this.model.has('classDescription' ) ? this.model.get('classDescription' ).toJSON() : null
            }
        },
        className: 'destination',

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
            this.scenicChannel.commands.execute( 'confirm', i18n.t('Are you sure you want to remove the __destinationName__ destination?', {destinationName:this.model.get('name')}), function( confirmed ) {
                if ( confirmed ) {
                    self.model.destroy();
                }
            });
        }
    } );

    return Destination;
} );
