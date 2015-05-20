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
            'click @ui.create': 'create'
        },

        initialize: function ( config ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.title = $.t('Create an RTP destination');
            this.callback = config.callback;
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