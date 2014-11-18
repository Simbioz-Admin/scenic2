define(

  /** 
   *  A module for creating collection of clients
   *  @exports collections/clients
   */


  [
    'underscore',
    'backbone',
    'models/destinationRtp',
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
        url: '/quidds/dico/properties/destinationsRtp/values/',
        parse: function(results, xhr) {
          return results;
        },

        /** Initialization of the clients collection
         *  We declare all events for receive information about clients
         */

        initialize: function() {

          var that = this;

          /** Event called when the server add a new destination (client) */
          socket.on("create_destination", function(destination) {
            that.add(destination);
            // views.global.notification("info", "the destination " + destination.name + " is added");
          });

          /** Event called when the server has removed a destination (client) */
          socket.on("remove_destination", function(id) {
            var model = that.get(id);
            model.trigger('destroy', model, that);
            $("[data-hostname='" + model.get("name") + "']").remove();
            // views.global.notification("info", "Destination " + name + " is deleted");
          });

          /** Event called when a connection is made between a source and a destination */
          socket.on("add_connection", function(quiddName, path, port, id) {
            var model = that.get(id);
            model.get("data_streams").push({
              quiddName: quiddName,
              path: path,
              port: port
            });
            $("[data-path='" + path + "'] [data-id='" + id + "']").addClass("active");
            $("[data-path='" + path + "'] [data-id='" + id + "']").html(port);
          })

          /** Event called when a connection between a source and a destination is removed  */
          socket.on("remove_connection", function(path, id) {
            var streamsModel = that.get(id).get('data_streams');
            _.each(streamsModel, function(stream, i) {
              if (stream.path == path) streamsModel.splice(i, 1);
            });
            $("[data-path='" + path + "'] [data-id='" + id + "']").removeClass("active");
            $("[data-path='" + path + "'] [data-id='" + id + "']").html("");
          })

        },

      });

    return DestinationsCollection;
  })