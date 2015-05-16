define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/inspector.html',
    'view/scenic/inspector/CreateQuiddity'
], function ( _, Backbone, Marionette, InspectorTemplate, CreateQuiddityView ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Marionette.ItemView
     */
    var Inspector = Backbone.Marionette.LayoutView.extend( {
        tagName:   'div',
        className: 'inspector-info-panel info-panel ui-draggable',
        template:  _.template( InspectorTemplate ),

        regions: {
            panel: '.panel'
        },

        initialize: function () {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.scenicChannel.commands.setHandler( 'create:quiddity', _.bind( this._onCreateQuiddity, this ) );
            this.scenicChannel.vent.on( 'created:quiddity', _.bind( this._onCreatedQuiddity, this ) );
        },

        /**
         * Create Quiddity Handler
         * Display the quiddity creation form
         *
         * @param classDescription
         * @private
         */
        _onCreateQuiddity: function ( classDescription ) {
            var self = this;
            // Load devices before continuing
            classDescription.loadDevices( function ( error, devices ) {
                if ( error ) {
                    return;
                }
                self.showChildView( 'panel', new CreateQuiddityView( {model: classDescription} ) );
                console.log(self);
                self.$el.show();
            } );
        },

        /**
         * Creates Quiddity Handler
         * Removes the quiddity creation form
         *
         * @param classDescription
         * @private
         */
        _onCreatedQuiddity: function ( classDescription ) {
            this.getRegion( 'panel' ).empty();
            this.$el.hide();
        }

    } );
    return Inspector;
} );