define(

  /** 
   *    Model of Table
   *    Table is for organise in different table the source and destination
   *    @exports Models/table
   */

  [
    'underscore',
    'backbone',
    'views/table',
    'views/source',
  ],

  function(_, Backbone, ViewTable, ViewSource) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires ViewTable
     *  @augments module:Backbone.Model
     */

    var TableModel = Backbone.Model.extend(

      /**
       *    @lends module: Models/table~TableModel.prototype
       */

      {
        idAttribute: "name",
        defaults: {
          "name": null,
          "type": null,
          "description": null,
          "menus": [],
          "collectionSources": null,
          "collectionDestinations": null
        },

        /* Called when the table is initialized and create a view */

        initialize: function() {

          /* Create collection source and destination */
          /* we check if it's already a collection */

          var quiddsSources = this.get_quidds("sources");
          this.set("collectionSources", new Backbone.Collection);
          this.get("collectionSources").add(quiddsSources);


          if (!this.get("collectionDestinations")) {
            var quiddsDestinations = this.get_quidds("destinations");
            this.set("collectionDestinations", new Backbone.Collection);
            this.get("collectionDestinations").add(quiddsDestinations);

          }else {
            console.log(this.get("collectionDestinations"));
          }

          /* Create view for the table and associate this model */
          var viewTable = new ViewTable({
            model: this
          });
        },

        /* Return the quiddities authorize baded on tyoe (source or destination) */
        get_quidds: function(orientation) {

          /* parse global collection quidds contains all quidds already created for return just what you want */
          if (this.get(orientation)) {
            var quiddsSelect = this.get(orientation).select;
            return collections.quidds.SelectQuidds(quiddsSelect);
          }
        },

        /* Return list of quiddity you can created for this table */
        classes_authorized: function(orientation) {

          var classes, that = this;

          if (!this.get(orientation)) return null;

          /* if specified category selected */
          if (this.get(orientation).select) {
            classes = collections.classesDoc.getByCategory(this.get(orientation).select);
          } else {
            classes = collections.classesDoc.toJSON();
          }

          if (this.get(orientation).exclude) {
            classes = _.filter(classes, function(clas) {
              if (!_.contains(that.get(orientation).exclude, clas["category"])) return clas
            });
          }

          return classes;

        },

        is_authorize: function(quiddClass) {
          var authorized_source = _.find(this.classes_authorized("sources"), function(clas) {
            return clas["class name"] == quiddClass;
          });

          var authorized_destination = _.find(this.classes_authorized("destinations"), function(clas) {
            return clas["class name"] == quiddClass;
          });

          return {
            source: authorized_source ? true : false,
            destination: authorized_destination ? true : false
          }
        },
      });

    return TableModel;
  })