define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'text!template/scenic/inspector/createRTP.html'
], function ( _, Backbone, Marionette, i18n, CreateRTPTemplate ) {

    /**
     * Create RTP Form
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var CreateRTP = Marionette.ItemView.extend( {
        template: _.template( CreateRTPTemplate ),
        className: 'create-rtp',
        ui:       {
            'name': '.name',
            'host': '.host',
            'port': '.port',
            'create': '#create'
        },
        events:   {
            'click @ui.create': 'create',
            'keydown': 'checkForEscapeKey',
            'keypress @ui.name': 'checkForEnterKey',
            'keypress @ui.host': 'checkForEnterKey',
            'keypress @ui.port': 'checkForEnterKey'
        },

        initialize: function ( config ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.title = $.t('Create an RTP destination');
            this.callback = config.callback;
        },

        onAttach: function() {
            _.defer( _.bind( this.ui.name.focus, this.ui.name ) );
        },

        checkForEscapeKey: function( event ) {
            var key = event.which || event.keyCode;
            if ( key == 27 ) {
                event.preventDefault();
                this.scenicChannel.commands.execute( 'inspector:close' );
            }
        },

        checkForEnterKey: function( event ) {
            var key = event.which || event.keyCode;
            if ( key == 13 ) {
                event.preventDefault();
                this.create();
            }
        },

        create: function() {
            this.callback( {
                name: this.ui.name.val(),
                host: this.ui.host.val(),
                port: this.ui.port.val()
            });
        }

    } );
    return CreateRTP;
} );