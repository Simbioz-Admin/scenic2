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
            'update': '#update'
        },

        events:   {
            'click @ui.update': 'update',
            'keydown': 'checkForEscapeKey',
            'keypress @ui.name': 'checkForEnterKey',
            'keypress @ui.host': 'checkForEnterKey',
            'keypress @ui.port': 'checkForEnterKey'
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
                this.update();
            }
        },
        
        update: function() {
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