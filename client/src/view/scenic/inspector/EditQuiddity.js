define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'view/scenic/inspector/edit/Properties',
    'view/scenic/inspector/edit/Methods',
    'text!template/scenic/inspector/editQuiddity.html'
], function ( _, Backbone, Marionette, i18n, PropertiesView, MethodsView, EditQuiddityTemplate ) {

    /**
     * Edit Quiddity Form
     *
     * @constructor
     * @extends module:Marionette.LayoutView
     */
    var EditQuiddity = Marionette.LayoutView.extend( {
        template: _.template( EditQuiddityTemplate ),
        className: 'edit-quiddity',

        regions: {
            properties: '.properties',
            methods: '.methods'
        },

        initialize: function ( options ) {
            this.inspector = options.inspector;

            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.scenicChannel.vent.on( 'quiddity:removed', _.bind( this._onQuiddityRemoved, this ) );

            this.title = $.t('Edit __quiddityName__', { quiddityName: this.model.get('name')});
        },

        onBeforeShow: function() {
            this.showChildView('properties', new PropertiesView({collection: this.model.get('properties')}));
            this.showChildView('methods', new MethodsView({collection: this.model.get('methods')}));
        },

        _onQuiddityRemoved: function( quiddity ) {
            if ( quiddity.id == this.model.id ) {
                this.scenicChannel.commands.execute( 'inspector:close' );
            }
        }

    } );
    return EditQuiddity;
} );