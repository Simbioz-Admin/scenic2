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
        template:  _.template( EditQuiddityTemplate ),
        className: 'edit-quiddity',

        regions: {
            properties: '.properties',
            methods:    '.methods'
        },

        modelEvents: {
            'destroy': '_onQuiddityRemoved'
        },

        events: {
            'keypress': 'checkForEscapeKey'
        },

        initialize: function ( options ) {
            this.scenic    = options.scenic;
            this.inspector = options.inspector;
            this.title     = i18n.t( 'Edit __quiddityName__', { quiddityName: this.model.id } );
        },

        onBeforeShow: function () {
            this.showChildView( 'properties', new PropertiesView( { collection: this.model.properties } ) );
            this.showChildView( 'methods', new MethodsView( { collection: this.model.methods } ) );
        },

        checkForEscapeKey: function ( event ) {
            var key = event.which || event.keyCode;
            if ( key == 27 ) {
                event.preventDefault();
                this.scenic.sessionChannel.commands.execute( 'inspector:close' );
            }
        },

        _onQuiddityRemoved: function ( quiddity ) {
            this.scenic.sessionChannel.commands.execute( 'inspector:close' );
        }

    } );
    return EditQuiddity;
} );