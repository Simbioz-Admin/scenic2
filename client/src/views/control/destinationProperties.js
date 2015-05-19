define(

  /** 
   *	View ControlProperties
   *	Manage the event global (not associate to a model) for the properties in table control
   *	@exports Models/ControlProperties
   */

  [
    'underscore',
    'backbone',
    'lib/socket',
    'text!../../../templates/table/sub_menu.html'
  ],

  function(_, Backbone, socket, TemplateSubMenu) {

    /** 
     *	@constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @augments module:Backbone.Model
     */

    var ControlPropertiesView = Backbone.View.extend(

      /**
       *	@lends module: Views/ControlProperties~ControlPropertiesView.prototype
       */


      {
        el: 'body',
        events: {
          "click .createControlProperty": "createControlProperty",
          "click .connect-properties": "connectProperties",
          "click #get_properties .menuButton": "show_properties",
          "mouseleave #subMenu": 'leaveSubMenu'
        },


        /* Called when the view ControlProperties is initialized */

        initialize: function() {},


        /*  Called when a property is selected on the dropdown menu in table controler (add destination) */

        createControlProperty: function(element) {
          var property = $(element.currentTarget).data("property"),
          that = this,
          quiddName = $(element.currentTarget).closest("div").data("quiddname");

          console.log( "Creating property", property, "for quidd", quiddName );

          this.collection.create(quiddName, property, function(quiddName) {
            //TODO: Use a filtered collection to manage these lists
            $(element.currentTarget).remove();
          });
        },


        show_properties: function(e) {

          $("#subMenu").remove();

          // return;

          var quidds = {};
          collections.quiddities.each(function(quidd) {
            var quiddCategory = quidd.get("category");
            if (quiddCategory.indexOf("System") == -1 && quiddCategory.indexOf("mapper") == -1 && quidd.get("class") != "midisrc") {
              var listProperties = [];
              _.each(quidd.get("properties"), function(property) {
                if (!collections.controlDestinations.get(quidd.get("name") + "_" + property.name) && property.writable == "true" && property.name != "started" && property.type != "string") {
                  listProperties.push(property.name);
                  quidds[quidd.get("name")] = listProperties;
                }
              });
            }
          });

          if (!$.isEmptyObject(quidds)) {
            var template = _.template(TemplateSubMenu)( {
              type: "QuiddsAndProperties",
              menus: quidds
            });

            $(e.target).after(template);

            $("#subMenu").accordion({
              collapsible: true,
              active: false,
              heightStyle: "content",
              icons: false,
              animate: 125
            });

            $(".createControlProperty" ).button();

          } else {
            views.global.notification("error", $.t("you need to create source before adding a property"));
          }
        },

        leaveSubMenu: function(e) {
          $("#subMenu").remove();
        },

        /* Called when choose to create a connection between a quiddity control (midi) and a destination */

        connectProperties: function(element) {

          if ($(element.target).attr("class").indexOf("connect-properties") == -1) return false;

          var quiddSource = $(element.target).closest(".quiddity").data("quiddname"),
          propertySource = $(element.target).parent().data("propertyname"),
          destination = $(element.target).data("nameandproperty").split("_"),
          sinkSource = destination[0],
          sinkProperty = destination[1],
          nameQuidd = "mapper_" + quiddSource + "_" + propertySource + "_" + $(element.target).data("nameandproperty");


          if (!quiddSource || !propertySource || !destination || !nameQuidd) return views.global.notification("error", $.t("missing info !"));
          socket.emit("create", "property-mapper", nameQuidd, function(err, infoQuidd) {
            // var model = collections.quidds.create(infoQuidd);
            socket.emit("invoke", infoQuidd.name, "set-source-property", [quiddSource, propertySource], function(ok) {});
            socket.emit("invoke", infoQuidd.name, "set-sink-property", [sinkSource, sinkProperty], function(ok) {});
          });
        }
      });

    return ControlPropertiesView;
  });