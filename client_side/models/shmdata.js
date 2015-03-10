define(

  /** 
   *  Manage all interaction between the server/views with a specific quiddity
   *  @exports Models/Shmdata
   */

  [
    'underscore',
    'backbone',
    'views/shmdata'
  ],

  function(_, Backbone, ViewShmdata) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @augments module:Backbone.Model
     */

    var ShmdataModel = Backbone.Model.extend(

      /**
       *  @lends module:Models/quidd~ShmdataModel.prototype
       */

      {
        idAttribute: "path",
        defaults: {
          path: null,
          quidd: null,
          byteRate: 0,
          category: null,
          type: null
        },

        /**
         *  Function executed when the model quiddity is created
         *  It's used for created a view associate to the model
         *  This view need to know if it's in table controler or transfer and if it's a source or destination
         */

        initialize: function() {

          /* listen if the quidd is removed */
          if (this.get("quidd")) {
            collections.quidds.get(this.get("quidd")).on("remove", this.removeModel, this);
          }
        },

        removeModel: function() {
          console.log("Remove Shmdata");
          this.trigger("destroy", this);
        }
      }
    );
    return ShmdataModel;
  });