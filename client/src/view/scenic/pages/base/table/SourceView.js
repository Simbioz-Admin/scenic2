"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'i18n',
    'view/scenic/pages/base/table/source/ShmdataView',
    'text!template/scenic/pages/base/table/source.html'
], function ( _, Backbone, Marionette, i18n, ShmdataView, SourceTemplate ) {

    /**
     * Source View
     *
     * @constructor
     * @extends module:Marionette.CompositeView
     */
    var SourceView = Marionette.CompositeView.extend( {
        template:           _.template( SourceTemplate ),
        templateHelpers: function() {
            return {
                startable: this.model.get('properties' ).get('started' ) != null,
                started: this.model.get('properties' ).get('started' ) ? this.model.get('properties' ).get('started' ).get('value') : true,
                classDescription: this.model.get('classDescription' ).toJSON()
            }
        },
        className:          'quiddity source',
        getChildView: function( item ) {
            return this.options.sourceChildView ?
                    this.options.sourceChildView :
                    ( this.childView ?
                        this.childView :
                        ShmdataView
                   );
        },
        childViewOptions:   function () {
            return {
                table:          this.options.table,
                collection:     this.options.table.getDestinationCollection(),
                connectionView: this.options.connectionView
            }
        },
        childViewContainer: '.source-children',

        ui: {
            edit:   '.actions .action.edit',
            remove: '.actions .action.remove',
            power: '.actions .action.power'
        },

        events: {
            'click @ui.edit':   'editSource',
            'click @ui.remove': 'removeSource',
            'click @ui.power': 'togglePower'
        },

        /**
         * Initialize
         */
        initialize: function (options) {
            this.scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );
            this.table = options.table;
            this.collection    = this.model.shmdatas;
            if ( this.model.properties.get('started' ) ) {
                this.listenTo( this.model.properties.get( 'started' ), 'change:value', this.render );
            }
        },

        /**
         * Filter shmdata per table
         *
         * @param shmdata
         * @returns {boolean}
         */
        filter: function ( shmdata ) {
            // Get back up to the table model to filter the displayed connections
            //return this.options.table.filterShmdata( shmdata, true );
            return shmdata.get('type') == 'writer';
        },

        /**
         * Edit Handler
         * @param event
         */
        editSource: function ( event ) {
            this.model.edit();
        },

        /**
         * Remove Handler
         * @param event
         */
        removeSource: function ( event ) {
            var self = this;
            this.scenicChannel.commands.execute( 'confirm', i18n.t( 'Are you sure you want to remove the __sourceName__ source?', {sourceName: this.model.id} ), function ( confirmed ) {
                if ( confirmed ) {
                    self.model.destroy();
                }
            } );
        },

        togglePower: function( event ) {
            var self = this;
            if (  this.model.get('properties' ).get('started' ) ) {
                if ( this.model.get('properties' ).get('started' ).get('value') ) {
                    this.scenicChannel.commands.execute( 'confirm', i18n.t( 'Are you sure you want to stop __quiddity__ source?', {quiddity: this.model.id} ), function ( confirmed ) {
                        if ( confirmed ) {
                            self.model.get('properties' ).get('started' ).updateValue( false );
                        }
                    } );
                } else {
                    self.model.get('properties' ).get('started' ).updateValue( true );
                }
            }
        }
    } );

    return SourceView;
} );
