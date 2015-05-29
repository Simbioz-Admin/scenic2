define( [
    'underscore',
    'backbone',
    'marionette',
    'text!template/scenic/inspector/shmdataInfo.html'
], function ( _, Backbone, Marionette, ShmdataInfoTemplate ) {

    /**
     * Shmdata Info Panel
     *
     * @constructor
     * @extends module:Marionette.ItemView
     */
    var ShmdataInfo = Marionette.ItemView.extend( {
        template: _.template( ShmdataInfoTemplate ),
        className: 'shmdata-info',

        modelEvents: {
            'change': 'render'
        },

        templateHelpers: function() {

            var capabilities = this.model.get('caps').split(', ');
            capabilities = _.map( capabilities, function( capString ) {
                var parts = capString.split('=');
                var property = parts[0];
                var type = null;
                var value = parts.length > 1 ? parts[1] : null;
                if ( parts.length > 1 ) {
                    var info = /\((.*)\)(.*)/.exec(parts[1]);
                    if ( info.length == 3 ) {
                        type = info[1];
                        value = info[2];
                    } else {
                        value = parts[1];
                    }
                }
                return { property: property, type: type, value: value };
            } );

            return {
                capabilities: capabilities
            }
        },

        initialize: function () {
            this.title = $.t('Shmdata info for __shmdata__', { shmdata: this.model.get('name')});

        }
    } );

    return ShmdataInfo;
} );