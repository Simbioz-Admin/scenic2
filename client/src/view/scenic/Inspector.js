define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/inspector.html',
    'view/scenic/inspector/CreateQuiddity',
    'view/scenic/inspector/EditQuiddity',
    'view/scenic/inspector/ShmdataInfo'
], function ( _, Backbone, Marionette, InspectorTemplate, CreateQuiddityView, EditQuiddityView, ShmdataInfoView ) {

    /**
     *  @constructor
     *  @augments module:Marionette.ItemView
     */
    var Inspector = Marionette.LayoutView.extend( {
        tagName:   'div',
        className: 'info-panel ui-draggable',
        template:  _.template( InspectorTemplate ),

        ui: {
            title: '.title',
            close: '.close'
        },

        events: {
            'click .close': 'close'
        },

        regions: {
            content: '.content'
        },

        childEvents: {
            'show': function () {
                this.ui.title.html(this.currentPanel.title);
            }
        },

        initialize: function () {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

            // Draggable
            this.$el.draggable( {
                cursor: "move",
                handle: ".title",
                containment: "window",
                opacity: 0.75
            } );

            this.scenicChannel.commands.setHandler( 'quiddity:create', _.bind( this._onQuiddityCreate, this ) );
            this.scenicChannel.commands.setHandler( 'quiddity:edit', _.bind( this._onQuiddityEdit, this ) );
            this.scenicChannel.commands.setHandler( 'shmdata:info', _.bind( this._onShmdataInfo, this ) );
        },

        close: function() {
            this.currentPanel = null;
            this.getRegion( 'content' ).empty();
            this.$el.hide();
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
                self.currentPanel = new CreateQuiddityView( {model: classDescription} );
                self.showChildView( 'content', self.currentPanel );
                self.$el.show();
            } );
        },

        /**
         * Edit Quiddity Handler
         * Display the quiddity edition form
         *
         * @param {Quiddity} quiddity
         * @private
         */
        _onQuiddityEdit: function ( quiddity ) {
            this.currentPanel = new EditQuiddityView( {model: quiddity} );
            this.showChildView( 'content', this.currentPanel );
            this.$el.show();
        },

        /**
         * Show Information Panel for shmdata
         *
         * @param {Shmdata} shmdata
         * @private
         */
        _onShmdataInfo: function( shmdata ) {
            this.currentPanel = new ShmdataInfoView( {model: shmdata} );
            this.showChildView( 'content', this.currentPanel );
            this.$el.show();
        }

    } );
    return Inspector;
} );