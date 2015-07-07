define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'text!template/scenic/inspector/addContact.html'
], function ( _, Backbone, Marionette, i18n, AddContactTemplate ) {

    /**
     * EAdddit Contact Form
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var AddContactView = Marionette.ItemView.extend( {
        template: _.template( AddContactTemplate ),
        className: 'edit-contact',

        ui:       {
            'uri': '.uri',
            'add': '#addContact'
        },

        events:   {
            'click @ui.add': 'add',
            'keydown': 'checkForEscapeKey',
            'keypress @ui.uri': 'checkForEnterKey'
        },

        initialize: function ( config ) {
            this.title = i18n.t('Add Contact');
            this.callback = config.callback;
        },

        onAttach: function() {
            _.defer( _.bind( this.ui.uri.focus, this.ui.uri ) );
        },

        checkForEscapeKey: function( event ) {
            var key = event.which || event.keyCode;
            if ( key == 27 ) {
                event.preventDefault();
                this.scenic.sessionChannel.commands.execute( 'inspector:close' );
            }
        },

        checkForEnterKey: function( event ) {
            var key = event.which || event.keyCode;
            if ( key == 13 ) {
                event.preventDefault();
                this.add();
            }
        },

        add: function() {
            if ( !_.isEmpty( this.ui.uri.val() ) ) {
                this.callback( this.ui.uri.val() );
            }
            this.scenic.sessionChannel.commands.execute( 'inspector:close' );
        }

    } );
    return AddContactView;
} );