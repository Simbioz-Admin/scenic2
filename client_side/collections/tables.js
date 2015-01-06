define(

  /** 
   *  Manage the collection of table. By default we have table controler and transfer
   *  @exports collections/tables
   */

  [
    'underscore',
    'backbone',
    'models/table'
  ],
  function(_, Backbone, ModelTable) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires ModelTable
     *  @augments module:Backbone.Collection
     */

    var CollectionTables = Backbone.Collection.extend(

      /**
       *  @lends module:collections/tables~CollectionTables.prototype
       */

      {
        model: ModelTable,
        currentTable: config.defaultPanelTable,


        /** Execute when the collection is initialized
         *  We declare all events for receive information about quiddities
         */

        initialize: function() {

          /* Create a table for manage Audio device and connexion */
          var shmdataMatrix = {
            name: 'Sink',
            type: 'sink',
            id :"sink",
            description: "Manage audio device and connexion audio",
            menus: [{
              name: "Source",
              type: "sources"
            }, {
              name: "sink",
              type: "destinations"
            }],
            sources: {
              select: ["src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "texturetomeshsink", "pcldetectsink", "meshmergesink"]
            },
            destinations: {
              select: ["sink"],
              exclude: ["monitor"]
            }
          }

          /* Create a table for managing shmdatas transmission throught RTP/SDP  */
          var RTPtransferMatrix = {
            name: "Transfer",
            type: "transfer",
            id: "transferRtp",
            description: "manage connexion with destination type host",
            menus: [{
              name: "source",
              type: "sources"
            }, {
              name: "destination RTP",
              type: "destinations",
              id: "create_receiver"
            }],
            sources: {
              select: ["src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"]
            },
            collectionDestinations: collections.destinationsRtp
          }

          /* Create matrix for manage connection between properties values and midi quiddity */
          var controlMatrix = {
            name: "Control",
            type: "control",
            id: "control",
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
              select: ["midisrc"],
            },
            collectionDestinations: collections.destinationsRtp
          }

          /* Manage transfer of shmdatas to the sip destination */
          var SIPtransferMatrix = {
            name: "SIP",
            type: "transfer",
            id : "transferSip",
            description: " Manage transfer of shmdatas to the sip destination",
            menus: [{
              name: "source",
              type: "sources"
            }],
            sources: {
              select: ["sip","src", "source", "httpsdpdec", "pclmergesink", "pcltomeshsink", "pcldetectsink", "texturetomeshsink", "meshmergesink"]
            },
            collectionDestinations: collections.users
            
          }

          this.add(controlMatrix);
          this.add(shmdataMatrix);
          this.add(RTPtransferMatrix);
          this.add(SIPtransferMatrix);

        }
      });
    return CollectionTables;
  })