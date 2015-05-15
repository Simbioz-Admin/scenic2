"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/Tabs',
    'view/scenic/SystemUsage',
    'view/scenic/Table',
    'view/scenic/Inspector',
    'text!../../template/table/inspector/createQuiddity.html'
], function ( _, Backbone, Marionette, TabsView, SystemUsageView, TableView, InspectorView, CreateQuiddityInspectorTemplate ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Marionette.LayoutView
     */
    var ScenicView = Backbone.Marionette.LayoutView.extend( {
        el: '#scenic',
        template: false,

        regions: {
            tabs: '#tabs',
            usage: '#usage',
            menu: '#header .menu',
            table: '#main',
            inspector: '#inspector'
        },

        childEvents: {
            'create:quiddity': function(){console.log('adasadas');}
        },

        initialize: function( app ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel('scenic');

            this.app = app;
            this.app.tables.on( 'change:current', _.bind( this._onShowTable, this ) );

            // Wreqr Handlers
            this.scenicChannel.commands.setHandler( 'create:quiddity', _.bind( this._onCreateQuiddity, this ) );
        },

        /**
         * Before Render
         * Special case for the moment as we don't use a master application view to render us
         */
        onBeforeRender: function() {
            console.debug( 'Scenic:onBeforeRender()');

            this.showChildView('tabs', new TabsView( { collection: this.app.tables }));
            this.showChildView('usage', new SystemUsageView());
            this.showChildView('table', new TableView( { model: this.app.tables.getCurrentTable() }));
        },

        _onShowTable: function( table ) {
            this.showChildView('table', new TableView( { model: table }));
        },

        _onCreateQuiddity: function( classDescription ) {
            var self = this;
            // Load devices before continuing
            classDescription.loadDevices( function( error, devices ) {
                if ( error ) {
                    return;
                }
                self.showChildView( 'inspector', new InspectorView( { model: classDescription, template: _.template( CreateQuiddityInspectorTemplate ) }));
            });
        }
    } );
    return ScenicView;
} );
