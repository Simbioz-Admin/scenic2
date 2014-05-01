define(

    /** 
     *	Manage the collection of table. By default we have table controler and transfer
     *	@exports collections/tables
     */

    [
        'underscore',
        'backbone',
        'models/table'
    ],
    function(_, Backbone, ModelTable) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires ModelTable
         *  @augments module:Backbone.Collection
         */

        var CollectionTables = Backbone.Collection.extend(

            /**
             *	@lends module:collections/tables~CollectionTables.prototype
             */

            {
                model: ModelTable,
                currentTable: config.defaultPanelTable,


                /** Execute when the collection is initialized
                 *	We declare all events for receive information about quiddities
                 */

                initialize: function() {


                    /* Create a table for manage Audio device and connexion */
                    var audioTable = {
                        name: 'audio',
                        type: 'audio',
                        description: "Manage audio device and connexion audio",
                        menus: [{
                            name: "audio source",
                            type: "sources"
                        }, {
                            name: "audio destination",
                            type: "destinations"
                        }],
                        sources: {
                            select: ["audio source", "httpsdpdec"]
                        },
                        destinations: {
                            select: ["audio sink"]
                        }
                    }




                    /* Create a table for manage transfer shmdatas  */

                    var transferTable = {
                        name: "transfer",
                        type: "transfer",
                        description: "manage connexion with destination type host",
                        menus: [{
                            name: "source",
                            type: "sources"
                        }, {
                            name: "destination",
                            type: "destinations",
                            id: "create_receiver"
                        }],
                        sources: {
                            select: ["source", "httpsdpdec"],
                            exclude: ["midi source"]
                        },
                        destinations: collections.receivers
                    }



                    var controlTable = {
                        name: "control",
                        type: "control",
                        description: "Control properties of quiddities with device",
                        menus: [{
                            name: "midi control",
                            type: "sources"
                        }, {
                            name: "properties",
                            type: "destinations",
                            id: "get_properties"
                        }],
                        sources: {
                            select: ["midi source"],
                        },
                        destinations: collections.receivers
                    }


                    this.add(audioTable);
                    this.add(controlTable);
                    this.add(transferTable);

                }
            });

        return CollectionTables;
    })