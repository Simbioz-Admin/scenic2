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

          /* if transfer we ask port for connect to the receiver */
          if (this.model.get("id") == "transferRtp") {
            /* if already connect */
            if (box.hasClass("active")) return socket.emit("remove_connection", path, destination, function(ok) {});
            box.html("<div class='content-port-destination' ><input id='port_destination' autofocus='autofocus' type='text' placeholder='"+$.t('specify an even port')+"'></div>");
          }

          /* if transferSip we ask to add shmdata to the user */
          if (this.model.get("id") == "transferSip") {
            var attach = box.hasClass("active") ? false : true;
            socket.emit("attachShmdataToUser", destination, path, attach, function(err, msg){
              if(err) return views.global.notification("error", err);
              views.global.notification("valid", msg);
            });
          }
          if (this.model.get("id") == "sink") {
            /* Find information about the number of connection possible */
            if (box.hasClass("active")) {
              socket.emit("invoke", destination, "disconnect", [path], function(data) {});
            } else {

              socket.emit('get_info', destination, 'shmdata', function(shmdata) {
                var nbConnectionExisting = (shmdata.reader != 'null') ? _.size(shmdata.reader) : 0;
                var maxReader = parseInt(shmdata.max_reader);
                if (maxReader > nbConnectionExisting  || maxReader == 0) {
                  socket.emit("invoke", destination, "connect", [path], function(data) {});

                } else {
                  if (maxReader == 1) {
                    socket.emit("invoke", destination, "disconnect-all", [], function(data) {
                      socket.emit("invoke", destination, "connect", [path], function(data) {});
                    });
                  } else {
                    views.global.notification('error', $.t('you have reached the maximum connection. The limit is ') + maxReader);
                  }
                }

              });


            }
          }

        },

        set_connection: function(e) {
          var that = this;

          if (e.which == 13) //touch enter
          {
            var box = $(e.target).parent(),
              id = $(e.target).closest("td").data("destination"),
              path = $(e.target).closest("tr").data("path"),
              quiddName = $(e.target).closest("tr").data("quiddname"),
              port = $(e.target).val(),
              portSoap = this.model.get("destinations").get(id).get("portSoap"),
              that = this;

            socket.emit("connect_destination", quiddName, path, id, port, portSoap, function(ok) {
              that.removeInputDestination(e);
            });
          }
        },

        /* 
         *  removes the input who we defined the port
         */
        removeInputDestination: function(element) {
          $(element.target).parent().parent().html("");
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
