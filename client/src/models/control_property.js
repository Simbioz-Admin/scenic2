define(

  /** 
   *  Model of Table
   *  Table is for organise in different table the source and destination
   *  @exports Models/controlProperty
   */

  [
    'underscore',
    'backbone',
    'lib/socket',
    'views/control/controlProperty'
  ],

  function(_, Backbone, socket, ViewControlProperty) {

    /** 
     *    @constructor
     *  @requires Underscore
     *  @requires Backbone
     *    @requires ViewControlProperty
     *  @augments module:Backbone.Model
     */

    var ModelControlProperty = Backbone.Model.extend(

      /**
       *  @lends module: Models/controlProperty~ModelControlProperty.prototype
       */

      {
        idAttribute: "name",
        defaults: {
          "name": null,
          "property": null,
          "quiddName": null
        },

        /**
         *    Function executed when the controlProperty is created
         */

        initialize: function() {
          var that = this;
          //when the model quidd is created and we are recovered all value necessary, we created automaticlly one or multiple views 
          _.each(collections.tables.toJSON(), function(table) {
            if (table.type == "control") {
              var viewControlProperty = new ViewControlProperty({
                model: that,
                table: "control"
              });
            }
          });

        },


        /**
         *    Allows to remove a specific controlProperty and mapper associate (connection on table control)
         */

        askDelete: function() {
          var that = this;
          views.global.confirmation(function(ok) {
              if (ok) {
                socket.emit("removeValuePropertyOfDico", "controlDestinations", that.get("name"));
              }
          });
        }
      }
    );

    return ModelControlProperty;
  });