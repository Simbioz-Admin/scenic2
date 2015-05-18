"use strict";

define( [
    'underscore',
    'jquery',
    'backbone',
    'model/Table'
], function ( _, $, Backbone, Table ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Collection
     */
    var Tables = Backbone.Collection.extend( {
        model:        Table,
        currentTable: null,

        initialize: function () {

            //  ┌─┐┬┌┐┌┬┌─
            //  └─┐││││├┴┐
            //  └─┘┴┘└┘┴ ┴

            this.add( new Table( {
                name:        $.t( 'Sink' ),
                type:        'sink',
                id:          "sink",
                description: $.t( "Manage audio/video devices and connections" ),
                menus:       [{
                    name: $.t( "Sources" ),
                    type: "source"
                }, {
                    name: $.t( "Sink" ),
                    type: "destination"
                }],
                source:      {
                    include: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "texturetomeshsink", "pcldetectsink", "meshmergesink"]
                },
                destination: {
                    include: ["sink"],
                    exclude: ["monitor"]
                }
            } ) );

            //  ┬─┐┌┬┐┌─┐
            //  ├┬┘ │ ├─┘
            //  ┴└─ ┴ ┴

            this.add( new Table( {
                name:                   $.t( 'Transfer' ),
                type:                   "transfer",
                id:                     "transferRtp",
                description:            $.t( "Manage connexions with host destination" ),
                menus:                  [{
                    name: $.t( "Sources" ),
                    type: "source"
                }, {
                    name: $.t( "RTP Destination" ),
                    type: "destination"
                }],
                source:                 {
                    include: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"]
                }
            } ) );

            //  ┌─┐┌─┐┌┐┌┌┬┐┬─┐┌─┐┬
            //  │  │ ││││ │ ├┬┘│ ││
            //  └─┘└─┘┘└┘ ┴ ┴└─└─┘┴─┘

            this.add( new Table( {
                name:                   $.t( "Control" ),
                type:                   "control",
                id:                     "control",
                description:            "Control properties of quiddities with devices",
                menus:                  [{
                    name: $.t( "MIDI Controls" ),
                    type: "source"
                }, {
                    name: $.t( "Properties" ),
                    type: "destination"
                }],
                source:                 {
                    include: ["midisrc"]
                }
            } ) );

            //  ┌─┐┬┌─┐
            //  └─┐│├─┘
            //  └─┘┴┴

            this.add( new Table( {
                name:                   $.t( "SIP" ),
                type:                   "transfer",
                id:                     "transferSip",
                description:            $.t( "Manage transfer of shmdatas to SIP contacts" ),
                menus:                  [{
                    name: $.t( "Sources" ),
                    type: "source"
                }],
                source:                 {
                    include: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"]
                }
            } ) );

            // Current
            if ( localStorage.getItem( "currentTable" ) ) {
                this.setCurrentTable( this.get( localStorage.getItem( "currentTable" ) ) );
            } else {
                this.setCurrentTable( this.get( config.defaultPanelTable ) );
            }
        },

        /**
         * Get the current table
         *
         * @returns {*}
         */
        getCurrentTable: function () {
            if ( this.currentTable ) {
                return this.currentTable;
            } else if ( localStorage.getItem( 'currentTable' ) ) {
                return this.get( localStorage.getItem( 'currentTable' ) );
            } else {
                return this.get( config.defaultPanelTable );
            }
        },

        /**
         * Set current table
         *
         * @param table
         */
        setCurrentTable: function ( table ) {
            if ( this.currentTable ) {
                this.currentTable.set( 'active', false );
            }
            this.currentTable = table;
            localStorage.setItem( 'currentTable', this.currentTable ? this.currentTable.get( 'id' ) : null );
            if ( this.currentTable ) {
                this.currentTable.set( 'active', true );
            }
            this.trigger( 'change:current', this.currentTable );
        }
    } );

    return Tables;
} );
