define( [
    'underscore',
    'backbone',
    'marionette'
], function ( _, Backbone, Marionette ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Marionette.ItemView
     */
    var InspectorPanel = Backbone.Marionette.ItemView.extend( {

        initialize: function () {
            //TODO: After render $( "#inspector .inspector-info-panel" ).i18n();
        },

        onAttach: function() {

        }

    } );
    return InspectorPanel;
} );