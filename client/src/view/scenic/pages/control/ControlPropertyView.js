"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/source/SourceChildView',
    'text!template/scenic/pages/control/property.html'
], function ( _, Backbone, Marionette, SourceChildView, ControlPropertyTemplate ) {

    /**
     * Shmdata View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var ControlPropertyView = SourceChildView.extend( {
        template: _.template( ControlPropertyTemplate ),
        className: SourceChildView.prototype.className + ' control-property',

        ui: {
            info: '.actions .action.more',
            value: '.info .property-value',
            bar: '.bar'
        },

        events: {
            'click @ui.info': 'showInfo'
        },

        modelEvents: {
            'change:value': 'updateValue'
        },

        templateHelpers: function() {
            return {
                percent: function () {
                    if ( this.minimum != null && this.maximum != null ) {
                        return ( ( this.value - this.minimum ) / ( this.maximum - this.minimum ) ) * 100;
                    } else {
                        return 0;
                    }
                }
            }
        },

        /**
         * Initialize
         */
        initialize: function ( options ) {
            SourceChildView.prototype.initialize.apply( this, arguments );
        },

        onRender: function() {
            this.updateValue();
        },

        /**
         * Update displayed value, done here as it is more performant than simply re-rendering
         */
        updateValue: function() {
            // Update textual value
            this.ui.value.html( this.model.get('value') );

            var percent = 0;
            if ( this.model.get('minimum')!= null && this.model.get('maximum')!= null ) {
                percent = ( ( this.model.get('value')- this.model.get('minimum')) / ( this.model.get('maximum')- this.model.get('minimum')) ) * 100;
            }
            this.ui.bar.css('width', percent + '%');
        },

        /**
         * Show Info
         * @param event
         */
        showInfo: function ( event ) {
            //this.scenicChannel.commands.execute( 'shmdata:info', this.model );
        }
    } );

    return ControlPropertyView;
} );
