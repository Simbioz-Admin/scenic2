define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'text!template/scenic/inspector/editContact.html'
], function ( _, Backbone, Marionette, i18n, EditContactTemplate ) {

    /**
     * Edit Contact Form
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var EditContact = Marionette.ItemView.extend( {
        template:  _.template( EditContactTemplate ),
        className: 'edit-contact',

        ui: {
            'name':   '.name',
            'update': '#update',
            'delete': '#delete'
        },

        events: {
            'click @ui.update':  'update',
            'click @ui.delete':  'delete',
            'keydown':           'checkForEscapeKey',
            'keypress @ui.name': 'checkForEnterKey'
        },

        modelEvents: {
            'destroy': '_onContactRemoved'
        },

        initialize: function ( options ) {
            this.scenic   = options.scenic;
            this.title    = i18n.t( 'Edit Contact' );
            this.callback = options.callback;
        },

        onAttach: function () {
            _.defer( _.bind( this.ui.name.focus, this.ui.name ) );
        },

        checkForEscapeKey: function ( event ) {
            var key = event.which || event.keyCode;
            if ( key == 27 ) {
                event.preventDefault();
                this.scenic.sessionChannel.commands.execute( 'inspector:close' );
            }
        },

        checkForEnterKey: function ( event ) {
            var key = event.which || event.keyCode;
            if ( key == 13 ) {
                event.preventDefault();
                this.update();
            }
        },

        update: function () {
            if ( this.ui.name.val() != this.model.get( 'name' ) ) {
                this.callback( {
                    name: this.ui.name.val()
                } );
            }
            this.scenic.sessionChannel.commands.execute( 'inspector:close' );
        },

        delete: function () {
            var self = this;
            this.scenic.scenicChannel.commands.execute( 'confirm', i18n.t( 'Are you sure you want to remove __contact__ from your contacts?', { contact: this.model.get( 'name' ) } ), function ( confirmed ) {
                if ( confirmed ) {
                    self.model.destroy();
                }
            } );
        },

        _onContactRemoved: function () {
            this.scenic.sessionChannel.commands.execute( 'inspector:close' );
        }

    } );
    return EditContact;
} );