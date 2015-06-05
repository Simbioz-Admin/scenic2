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
