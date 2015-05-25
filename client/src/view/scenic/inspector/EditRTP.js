define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'text!template/scenic/inspector/editRTP.html'
], function ( _, Backbone, Marionette, i18n, EditRTPTemplate ) {

    /**
     * Edit RTP Form
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var EditRTP = Marionette.ItemView.extend( {
        template: _.template( EditRTPTemplate ),
        className: 'edit-rtp',

        ui:       {
            'name': '.name',
            'host': '.host',
            'port': '.port',
            'edit': '#update'
        },

        events:   {
            'click @ui.edit': 'edit'
        },

        modelEvents: {
            'destroy': '_onRTPDestinationRemoved'
        },

        initialize: function ( config ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.title = $.t('Edit an RTP destination');
            this.callback = config.callback;
        },

        onAttach: function() {
            _.defer( _.bind( this.ui.name.focus, this.ui.name ) );
        },

        edit: function() {
            this.callback( {
                name: this.ui.name.val(),
                host: this.ui.host.val(),
                port: this.ui.port.val()
            });
            this.scenicChannel.commands.execute( 'inspector:close' );
        },

        _onRTPDestinationRemoved: function(  ) {
            this.scenicChannel.commands.execute( 'inspector:close' );
        }

    } );
    return EditRTP;
} );