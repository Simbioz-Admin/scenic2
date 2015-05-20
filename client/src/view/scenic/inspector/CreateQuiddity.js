define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'model/Quiddity',
    'text!template/scenic/inspector/createQuiddity.html'
], function ( _, Backbone, Marionette, i18n, Quiddity, CreateQuiddityTemplate ) {

    /**
     * Create Quiddity Form
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var CreateQuiddity = Marionette.ItemView.extend( {
        template: _.template( CreateQuiddityTemplate ),
        className: 'create-quiddity',
        ui:       {
            'name': '#quiddityName',
            'device': '#device',
            'create': '#create'
        },
        events:   {
            'click @ui.create': 'create'
        },

        initialize: function () {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.title = $.t('Create __quiddityClass__', { quiddityClass: this.model.get('class name')});
        },

        onAttach: function() {
            var self = this;
            // A little time is necessary before focus() works
            setTimeout( function() {
                $( self.ui.name ).focus();
            }, 0 );
        },

        create: function() {
            var self = this;
            var name = this.ui.name.val();
            var device = this.ui.device.val();
            var quiddity = new Quiddity( { 'class': this.model.get('class name'), 'newName': name } );
            quiddity.save( null, {
                success: function ( quiddity ) {
                    if ( device ) {
                        quiddity.setProperty( 'device', this );
                    }
                },
                error:   function ( error ) {
                    self.scenicChannel.vent.trigger('error', error );
                }
            } );
        }

    } );
    return CreateQuiddity;
} );