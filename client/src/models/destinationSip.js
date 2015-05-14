define(

  /** 
   * Model of Client
   * The destination is a destination in table transfer
   * @exports Models/destination
   */

  [
    'underscore',
    'backbone',
    'lib/socket',
    'views/table/destination',
    'views/editDestination'
  ],

  function(_, Backbone, socket, ViewDestination, ViewEditDestination) {

    /** 
     * @constructor
     *  @requires Underscore
     *  @requires Backbone
     * @requires ViewDestination
     *  @augments module:Backbone.Model
     */

    var ClientModel = Backbone.Model.extend(

      /**
       * @lends module: Models/destination~ClientModel.prototype
       */

      {
        idAttribute: "name",
        defaults: {},


        /* Called when the table is initialized and create a view */

        initialize: function() {

          //we create automatically the view for destination based on ViewDestination
          var view = new ViewDestination({
            model: this,
            table: collections.tables.findWhere({
              id: "transferSip"
            })
          });

        },

        /**
         * Allows to ask for edit a specific destination
         */

        edit: function() {
          // var that = this;
          // new ViewEditDestination({
          //   model: that
          // });
        },

        /**
         * Allows to ask for remove a specific destination (destination)
         */

        askDelete: function() {
          var that = this;

          var result = views.global.confirmation("Are you sure?", function(ok) {
            if (ok) {
              socket.emit("removeDestinationSip", that.get("name"), function(err, msg) {
                if (err) return views.global.notification("error", err);
                views.global.notification("valid", msg)
              });
              //socket.emit("invoke", "defaultrtp", "remove_destination", [that.get("name")], function(ok) {});
            }
          });
        }
      });

    return ClientModel;
  })