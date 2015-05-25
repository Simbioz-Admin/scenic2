define(

  /** 
   *  View Table
   *  The Table view manages activities related to the table, render and actions on menu
   *  @exports Views/Table
   */

  [
    '../bower_components/underscore/underscore',
    'backbone',
    'lib/socket',
    'text!../../templates/table/table.html',
    'text!../../templates/table/category.html',
    'text!../../templates/table/sub_menu.html',
  ],

  function(_, Backbone, socket, TemplateTable, TemplateCategory, TemplateSubMenu) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires TemplateTable
     *  @requires TemplateSubMenu
     *  @augments module:Backbone.View
     */

    var TableView = Backbone.View.extend(

      /**
       *  @lends module: Views/Table~TableView.prototype
       */

      {
        tagName: 'div',
        className: 'table',
        events: {
          "click #create-quiddsProperties": "getMenuProperties",
          "click #create-midi": "getMenuMidiDevice",
          "click .contextMenu .menuButton": 'getClasses',
          "click body.scenic": 'leaveSubMenu',
          "click .box": "toggle_connection",
          "keypress #port_destination": "set_connection",
          "blur #port_destination": "removeInputDestination",
          "change .dropdown_filter": "filter_quiddities"
        },

        // FIXME: separate the menus views and shmdata/connections table and handle view events properly

        /* 
         * Called on initialization of the table (control / transfer)
         */

        initialize: function() {

          this.model.on("trigger:menu", this.getClasses, this);
          this.model.on("addCategoryFilter", this.addCategoryFilter, this);
          this.model.on("removeCategoryFilter", this.removeCategoryFilter, this);

          //translation
          $(this.el).i18n();

        },


        toggle_connection: function(e) {
          var box = $(e.currentTarget),
            destination = box.data("destination"),
            path = box.closest('.shmdata').data("path");

          console.log('toggle_connection');

          /* if transferSip we ask to add shmdata to the user */
          if (this.model.get("id") == "transferSip") {
            var attach = box.hasClass("active") ? false : true;
            socket.emit("attachShmdataToUser", destination, path, attach, function(err, msg){
              if(err) return views.global.notification("error", err);
              views.global.notification("valid", msg);
            });
          }

        },

        /* 
         * Called for get the list of device Midi
         */
        getMenuMidiDevice: function(element) {
          console.log("menu midi");
          $("#listDevicesMidi").remove();
          collections.classDescriptions.getPropertyByClass("midisrc", "device", function(property) {
            var devicesMidi = property["values"];
            _.each(devicesMidi, function(device, index) {
              collections.quiddities.each(function(quidd) {
                if (quidd.get("class") == "midisrc") {
                  _.each(quidd.get("properties"), function(property) {
                    if (property.name == "device" && property.value == device.name) delete devicesMidi[index];
                  });
                }
              });
            });

            var template = _.template(TemplateSubMenu)( {
              type: "devicesMidi",
              menus: devicesMidi
            });
            $(element.target).after(template);
          });
        },




      });

    return TableView;
  })
