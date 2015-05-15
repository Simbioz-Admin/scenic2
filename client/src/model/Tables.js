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

            /* Create a table for manage Audio device and connexion */
            this.add( new Table( {
                name:         $.t( 'Sink' ),
                type:         'sink',
                id:           "sink",
                description:  "Manage audio device and connexion audio",
                menus:        [{
                    name: "Source",
                    type: "sources"
                }, {
                    name: $.t( "Sink" ),
                    type: "destinations"
                }],
                sources:      {
                    select: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "texturetomeshsink", "pcldetectsink", "meshmergesink"]
                },
                destinations: {
                    select:  ["sink"],
                    exclude: ["monitor"]
                }
            } ) );

            /* Create a table for managing shmdatas transmission throught RTP/SDP  */
            var rtp = this.add( new Table( {
                name:                   $.t( 'Transfer' ),
                type:                   "transfer",
                id:                     "transferRtp",
                description:            "Manage connexion with destination type host",
                menus:                  [{
                    name: "source",
                    type: "sources"
                }, {
                    name: "destination RTP",
                    type: "destinations",
                    id:   "create_receiver"
                }],
                sources:                {
                    select: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"]
                },
                collectionDestinations: collections.destinationsRtp
            } ) );

            /* Create matrix for manage connection between properties values and midi quiddity */
            this.add( new Table( {
                name:                   $.t( "Control" ),
                type:                   "control",
                id:                     "control",
                description:            "Control properties of quiddities with device",
                menus:                  [{
                    name: $.t( "midi control" ),
                    type: "sources"
                }, {
                    name: $.t( "properties" ),
                    type: "destinations",
                    id:   "get_properties"
                }],
                sources:                {
                    select: ["midisrc"]
                },
                collectionDestinations: collections.destinationsRtp
            } ) );

            /* Manage transfer of shmdatas to the sip destination */
            this.add( new Table( {
                name:                   "SIP",
                type:                   "transfer",
                id:                     "transferSip",
                description:            "Manage transfer of shmdatas to the sip destination",
                menus:                  [{
                    name: "source",
                    type: "sources"
                }],
                sources:                {
                    select: ["sip", "src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"]
                },
                collectionDestinations: collections.users
            } ) );

            // Current
            if ( localStorage.getItem("currentTable") ) {
                this.setCurrentTable( this.get( localStorage.getItem("currentTable") ) );
            } else {
                this.setCurrentTable( this.get( config.defaultPanelTable ) );
            }
        },

        /**
         * Get the current table
         *
         * @returns {*}
         */
        getCurrentTable: function() {
            if ( this.currentTable ) {
                return this.currentTable;
            } else if ( localStorage.getItem('currentTable') ) {
                return this.get( localStorage.getItem('currentTable') );
            } else {
                return this.get( config.defaultPanelTable );
            }
        },

        /**
         * Set current table
         *
         * @param table
         */
        setCurrentTable: function( table ) {
            if ( this.currentTable ) {
                this.currentTable.set('active', false);
            }
            this.currentTable = table;
            localStorage.setItem('currentTable', this.currentTable ? this.currentTable.get('id') : null );
            if ( this.currentTable ) {
                this.currentTable.set('active', true);
            }
        }
    } );
    return Tables;
} );
