define(

  /** 
   *  A module for creating collection of clients
   *  @exports collections/clients
   */


  [
    'underscore',
    'backbone',
    'models/destinationSip',
  ],

  function(_, Backbone, ModelDestinationRtp) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires ModelDestinationRtp
     *  @augments module:Backbone.Collection
     */

    var DestinationsCollection = Backbone.Collection.extend(

      /**
       *  @lends module:collections/clients~DestinationsCollection.prototype
       */

      {
        model: ModelDestinationRtp,
        url: '/quidds/destinationsSip/properties/',
        timer: 5000,
        parse: function(results, xhr) {
          return results.properties;
        },

        /** Initialization of the clients collection
         *  We declare all events for receive information about clients
         */

        initialize: function() {

          var that = this;

          socket.on("addDestinationSip", function(destinationSip){
            console.log("ask add destinationSip");
            that.add({ name : destinationSip});
          });

          socket.on("removeDestinationSip", function(destinationSip){
            console.log("ask remove destinationSip");
            var model = that.get(destinationSip);
            model.trigger('destroy', model, that);
          });

        },

      });

    return DestinationsCollection;
  })