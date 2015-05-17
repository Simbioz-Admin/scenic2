define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/inspector.html',
    'view/scenic/inspector/CreateQuiddity',
    'view/scenic/inspector/EditQuiddity'
], function ( _, Backbone, Marionette, InspectorTemplate, CreateQuiddityView, EditQuiddityView ) {

    /**
     *  @constructor
     *  @augments module:Marionette.ItemView
     */
    var Inspector = Marionette.LayoutView.extend( {
        tagName:   'div',
        className: 'inspector-info-panel info-panel ui-draggable',
        template:  _.template( InspectorTemplate ),

        regions: {
            panel: '.panel'
        },

        initialize: function () {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            // Quiddity creation
            this.scenicChannel.commands.setHandler( 'quiddity:create', _.bind( this._onQuiddityCreate, this ) );

            // Quiddity editing
            this.scenicChannel.commands.setHandler( 'quiddity:edit', _.bind( this._onQuiddityEdit, this ) );
        },

        /**
         * Create Quiddity Handler
         * Display the quiddity creation form
         *
         * @param {ClassDescription} classDescription
         * @private
         */
        _onQuiddityCreate: function ( classDescription ) {
            var self = this;
            // Load devices before continuing
            classDescription.loadDevices( function ( error, devices ) {
                if ( error ) {
                    return;
                }
                self.showChildView( 'panel', new CreateQuiddityView( {model: classDescription} ) );
                self.$el.show();
            } );
        },

        /**
         * Creates Quiddity Handler
         * Removes the quiddity creation form
         *
         * @param quiddity
         * @private
         */
        /*_onQuiddityCreated: function ( quiddity ) {
            //this.getRegion( 'panel' ).empty();
            //this.$el.hide();
        },*/

        /**
         * Edit Quiddity Handler
         * Display the quiddity edition form
         *
         * @param {Quiddity} quiddity
         * @private
         */
        _onQuiddityEdit: function ( quiddity ) {
            this.showChildView( 'panel', new EditQuiddityView( {model: quiddity} ) );
            this.$el.show();
        }

    } );
    return Inspector;
} );