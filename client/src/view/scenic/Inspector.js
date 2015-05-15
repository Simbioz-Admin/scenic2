define( [
    'underscore',
    'backbone',
    'marionette'
], function ( _, Backbone, Marionette ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Marionette.ItemView
     */
    var Inspector = Backbone.Marionette.ItemView.extend( {
        tagName: 'div',
        className: 'inspector-info-panel info-panel ui-draggable',
        ui:       {

        },
        events:   {

        },

        getTemplate: function() {
            return this.options.template;
        },

        initialize: function () {
            //TODO: After render $( "#inspector .inspector-info-panel" ).i18n();
        },

        onAttach: function() {
            //Legacy
            $('#inspector' ).show();
            setTimeout( function () {
                $( "#inspector .inspector-info-panel #quiddName" ).focus();
            }, 1 );
        }

    } );
    return Inspector;
} );