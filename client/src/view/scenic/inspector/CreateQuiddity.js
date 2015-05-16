define( [
    'underscore',
    'backbone',
    'marionette',
    'model/Quiddity',
    'text!template/scenic/inspector/createQuiddity.html'
], function ( _, Backbone, Marionette, Quiddity, CreateQuiddityTemplate ) {

    /**
     * Create Quiddity Form
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var CreateQuiddity = Marionette.ItemView.extend( {
        template: _.template( CreateQuiddityTemplate ),
        ui:       {
            'name': '#quiddityName',
            'device': '#device',
            'create': '#create'
        },
        events:   {
            'click @ui.create': 'create'
        },

        initialize: function () {
            InspectorPanel.prototype.initialize.apply(this,arguments);
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
        },

        onAttach: function() {
            var self = this;
            // A little time is necessary before focus() works
            setTimeout( function() {
                $( self.ui.name ).focus();
            }, 1 );
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
                    self.scenicChannel.vent.trigger('quiddity:created', quiddity);
                },
                error:   function ( error ) {
                    self.scenicChannel.vent.trigger('error', error );
                }
            } );
        }

    } );
    return CreateQuiddity;
} );