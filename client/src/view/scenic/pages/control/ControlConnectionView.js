"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/pages/base/table/ConnectionView',
    'text!template/scenic/pages/control/connection.html'
], function ( _, Backbone, Marionette, ConnectionView, ControlConnectionTemplate ) {

    /**
     * Control Connection View
     *
     * @constructor
     * @extends ConnectionView
     */
    var ControlConnectionView = ConnectionView.extend( {
        template:  _.template( ControlConnectionTemplate ),

        ui: _.extend({}, ConnectionView.prototype.ui, {
            edit: '.action.edit'
        }),

        events:  _.extend({}, ConnectionView.prototype.events, {
            'click @ui.edit': 'editMapper'
        }),

        /**
         * Initialize
         */
        initialize: function ( options ) {
            ConnectionView.prototype.initialize.apply( this, arguments );
            this.listenTo(this.table.destinations,'update', this.render );
        },

        editMapper: function(event){
            event.stopImmediatePropagation();
            var mapper = this.table.getConnection(this.source, this.destination);
            if ( mapper ) {
                mapper.edit();
            }
        }
    } );

    return ControlConnectionView;
} );
