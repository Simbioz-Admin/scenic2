define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/inspector/CreateQuiddity',
    'view/scenic/inspector/EditQuiddity',
    'view/scenic/inspector/CreateRTP',
    'view/scenic/inspector/EditRTP',
    'view/scenic/inspector/ShmdataInfo',
    'view/scenic/inspector/AddContact',
    'view/scenic/inspector/EditContact',
    'text!template/scenic/inspector.html'
], function ( _, Backbone, Marionette,
              CreateQuiddityView, EditQuiddityView, CreateRTPView, EditRTPView, ShmdataInfoView, AddContactView, EditContactView,
              InspectorTemplate ) {

    /**
     *  @constructor
     *  @augments module:Marionette.ItemView
     */
    var Inspector = Marionette.LayoutView.extend( {
        tagName:   'div',
        className: 'info-panel',
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
                this.ui.title.html( this.currentPanel.title );
            }
        },

        initialize: function ( options ) {
            this.scenic = options.scenic;

            // Draggable
            this.$el.draggable( {
                cursor:      "move",
                handle:      ".title",
                containment: "window",
                opacity:     0.75
            } );
            // We need absolute at the start... to align right
            this.$el.css('position', '');

            this.scenic.sessionChannel.commands.setHandler( 'quiddity:create', _.bind( this._onQuiddityCreate, this ) );
            this.scenic.sessionChannel.commands.setHandler( 'quiddity:edit', _.bind( this._onQuiddityEdit, this ) );

            this.scenic.sessionChannel.commands.setHandler( 'rtp:create', _.bind( this._onRTPCreate, this ) );
            this.scenic.sessionChannel.vent.on( 'rtp:created', _.bind( this._onRTPCreated, this ) );
            this.scenic.sessionChannel.commands.setHandler( 'rtp:edit', _.bind( this._onRTPEdit, this ) );

            this.scenic.sessionChannel.commands.setHandler( 'contact:add', _.bind( this._onContactAdd, this ) );
            this.scenic.sessionChannel.commands.setHandler( 'contact:edit', _.bind( this._onContactEdit, this ) );

            this.scenic.sessionChannel.commands.setHandler( 'shmdata:info', _.bind( this._onShmdataInfo, this ) );
            this.scenic.sessionChannel.commands.setHandler( 'inspector:close', _.bind( this.close, this ) );
        },

        close: function () {
            this.currentPanel = null;
            this.getRegion( 'content' ).empty();
            this.$el.fadeOut( 250 );
        },

        /**
         * Create Quiddity Handler
         * Display the quiddity creation form
         * Uses a callback to confirm the creation request
         *
         * @param {ClassDescription} classDescription
         * @param callback
         * @private
         */
        _onQuiddityCreate: function ( classDescription, callback ) {
            this.currentPanel = new CreateQuiddityView( { scenic: this.scenic, model: classDescription, callback: callback} );
            this.showChildView( 'content', this.currentPanel );
            this.$el.fadeIn(250);
        },

        /**
         * Edit Quiddity Handler
         * Display the quiddity edition form
         *
         * @param {Quiddity} quiddity
         * @private
         */
        _onQuiddityEdit: function ( quiddity ) {
            this.currentPanel = new EditQuiddityView( {scenic: this.scenic, model: quiddity} );
            this.showChildView( 'content', this.currentPanel );
            this.$el.fadeIn( 250 );
        },

        /**
         * Create RTP Destination Handler
         * Display the RTP destination creation form
         * Uses a callback to confirm the creation request
         *
         * @param callback
         * @private
         */
        _onRTPCreate: function ( callback ) {
            this.currentPanel = new CreateRTPView({ scenic: this.scenic, callback: callback });
            this.showChildView( 'content', this.currentPanel );
            this.$el.fadeIn( 250 );
        },

        /**
         * RTP Destination Created Handler
         * Closes the panel
         *
         * @private
         */
        _onRTPCreated: function ( ) {
            this.close();
        },

        /**
         * Edit RTP Handler
         * Display the rtp edition form
         *
         * @param {RTPDestination} RTP Destination
         * @private
         */
        _onRTPEdit: function ( rtpDestination, callback ) {
            this.currentPanel = new EditRTPView( {scenic: this.scenic, model: rtpDestination, callback: callback} );
            this.showChildView( 'content', this.currentPanel );
            this.$el.fadeIn( 250 );
        },

        /**
         * Show Information Panel for shmdata
         *
         * @param {Shmdata} shmdata
         * @private
         */
        _onShmdataInfo: function ( shmdata ) {
            this.currentPanel = new ShmdataInfoView( {scenic: this.scenic, model: shmdata} );
            this.showChildView( 'content', this.currentPanel );
            this.$el.fadeIn( 250 );
        },

        /**
         * Add Contact Handler
         * Display the contact add form
         *
         * @private
         */
        _onContactAdd: function ( callback ) {
            this.currentPanel = new AddContactView( {scenic: this.scenic, callback: callback} );
            this.showChildView( 'content', this.currentPanel );
            this.$el.fadeIn( 250 );
        },

        /**
         * Edit Contact Handler
         * Display the contact edition form
         *
         * @param {Contact} contact
         * @private
         */
        _onContactEdit: function ( contact, callback ) {
            this.currentPanel = new EditContactView( {  scenic: this.scenic, model: contact, callback: callback} );
            this.showChildView( 'content', this.currentPanel );
            this.$el.fadeIn( 250 );
        }

    } );
    return Inspector;
} );