define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'text!template/scenic/inspector/createQuiddity.html'
], function ( _, Backbone, Marionette, i18n, CreateQuiddityTemplate ) {

    /**
     * Create Quiddity Form
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var CreateQuiddity = Marionette.ItemView.extend( {
        template:  _.template( CreateQuiddityTemplate ),
        className: 'create-quiddity',
        ui:        {
            'name':   '#quiddityName',
            'device': '#device',
            'create': '#create'
        },
        events:    {
            'click @ui.create': 'create'
        },

        initialize: function ( config ) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.title         = $.t( 'Create __quiddityClass__', {quiddityClass: this.model.get( 'class' )} );
            this.callback      = config.callback;

            //TODO: Handle devices stuff
            /*classDescription.loadDevices( function ( error, devices ) {
                                              if ( error ) {
                                                  return;
                                              }
                                          }
            );*/
        },

        onAttach: function() {
            _.defer( _.bind( this.ui.name.focus, this.ui.name ) );
        },

        create: function () {
            this.callback( {
                type:   this.model.get( 'class' ),
                name:   this.ui.name.val(),
                device: this.ui.device.val()
            } );
        }

    } );
    return CreateQuiddity;
} );