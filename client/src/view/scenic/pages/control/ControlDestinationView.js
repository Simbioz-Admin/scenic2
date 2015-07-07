"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/DestinationView',
    'text!template/scenic/pages/control/destination.html'
], function ( _, Backbone, Marionette, DestinationView, ControlDestinationTemplate ) {

    /**
     * Control Destination View
     *
     * @constructor
     * @extends DestinationView
     */
    var ControlDestination = DestinationView.extend( {
        template: _.template( ControlDestinationTemplate ),
        className: 'control destination',

        templateHelpers: function() {
            return {
                quiddity: this.model.has('property') ? this.model.get('property' ).collection.quiddity.toJSON() : null,
                property: this.model.has('property') ? this.model.get('property' ).toJSON() : null
            }
        },

        /**
         * Initialize
         */
        initialize: function( ) {
            DestinationView.prototype.initialize.apply(this, arguments);
        },

        /**
         * Remove Handler
         * @param event
         */
        removeDestination: function( event ) {
            var self = this;
            this.scenicChannel.commands.execute( 'confirm', i18n.t('Are you sure you want to remove all mappings to property __property__ of __quiddity__?', {
                quiddity: this.model.get('property' ).collection.quiddity.id,
                property: this.model.get('property' ).get('name')
            }), function( confirmed ) {
                if ( confirmed ) {
                    self.model.destroy();
                }
            });
        }
    } );

    return ControlDestination;
} );
