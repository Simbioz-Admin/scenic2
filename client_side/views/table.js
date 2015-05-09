define(

  /** 
   *  View Table
   *  The Table view manages activities related to the table, render and actions on menu
   *  @exports Views/Table
   */

  [
    'underscore',
    'backbone',
    'text!../../templates/table/table.html',
    'text!../../templates/table/category.html',
    'text!../../templates/table/sub_menu.html',
  ],

  function(_, Backbone, TemplateTable, TemplateCategory, TemplateSubMenu) {

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
          "mouseleave #subMenu": 'leaveSubMenu',
          "click body.scenic2": 'leaveSubMenu',
          "click .box": "toggle_connection",
          "keypress #port_destination": "set_connection",
          "blur #port_destination": "removeInputDestination",
          "change .dropdown_filter": "filter_quiddities",
        },

        // FIXME: separate the menus views and shmdata/connections table and handle view events properly

        /* 
         * Called on initialization of the table (control / transfer)
         */

        initialize: function() {

          this.model.on("trigger:menu", this.getClasses, this);
          this.model.on("addCategoryFilter", this.addCategoryFilter, this);
          this.model.on("removeCategoryFilter", this.removeCategoryFilter, this);

          /* generate a btn for the table */
          var currentTable = localStorage["currentTable"] ? localStorage["currentTable"] : config.defaultPanelTable;

          var active = (currentTable == this.model.get("id") ? "active" : "");
          var btnTable = $("<div></div>", {
            text: "",
            class: "tabTable " + this.model.get("type") + " " + this.model.get("name" ).toLowerCase() + " " + active,
            title: this.model.get("description"),
            data: {
              id: this.model.get("id"),
            }
          });

          btnTable.append("<div class='content'><div class='name'>"+this.model.get('name')+"</div></div>");
          $("#panelTables").prepend(btnTable);

          /* generate the table */
          var template = _.template(TemplateTable, {
            type: this.model.get("type"),
            menus: this.model.get("menus")
          });
          $(this.el)
            .attr("id", this.model.get("id"))
            .addClass(active)
            .html(template);


          /* add to the default panel */
          $("#panelLeft").append(this.el);
          //translation
          $(this.el).i18n();

        },


        /* 
         * Called to get list of quiddity source
         * The list of quiddity source is get when source word appear in name Class quiddity
         */
        getClasses: function(e) {
          $("#subMenu").remove();
          var shmdataType = e.target ? $(e.target ).parent().data("type") : e;

          /* get the quiddity classes authorized on this table */
          var classes = this.model.selectByCategory(shmdataType);
          /* we not load classes if nothing is return */
          if (classes && classes.length == 0) return;

          /* GroupBy category the list of classes */
          var classesByCategory = _.groupBy(classes, function(clas) {
            return clas.category;
          });

          var template = _.template(TemplateSubMenu, {
            type: "classes",
            classes: classesByCategory
          });

          $("#listSources", this.el).remove();
          $( e.target ).after(template);
          $('#listSources',this.el).i18n();

          // /* here we listen select for call views.quidds.defineName */
          // $("#subMenu").menu({
          //   // items: "> :not(.ui-widget-header)",
          //   //delay: 3500,
          //   // position: {
          //   //   at: "right-2 top-2"
          //   // }
          // }, {
          //   select: function(event, ui) {
          //     console.log("menu. item. selected", ui);
          //     // event.preventDefault();
          //     event.stopPropagation();
          //     views.quidds.defineName(ui.item);
          //   }
          // }).focus();

          $("#subMenu").accordion({
            collapsible: true,
            active: false,
            heightStyle: "content",
            icons: false,
            animate: 125
          });

          // $(".subMenu").menu({
          //   select: function(event, ui) {
          //     console.log("menu. item. selected", ui);
          //     // event.preventDefault();
          //     event.stopPropagation();
          //     views.quidds.defineName(ui.item);
          //   }
          // });
          $(".createQuidd").button()
            .click(function(){
              event.stopPropagation();
              views.quidds.defineName($(this));
            });

        },

        leaveSubMenu: function(e) {
          $("#subMenu").remove();
        },

        toggle_connection: function(e) {
          console.log('toggle_connection');
          var box = $(e.target),
            destination = box.data("destination"),
            path = box.parent().data("path");

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
              portSoap = this.model.get("collectionDestinations").get(id).get("portSoap"),
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
         *  called for showing list of properties existing
         *  We show only the propertie of quiddities added to the table transfer
         */
        getMenuProperties: function(element) {
          var quiddsMenu = {};
          collections.quidds.each(function(quidd) {
            var quiddCategory = quidd.get("category");
            if (quiddCategory.indexOf("source") != -1 && quidd.get("class") != "midisrc") {
              var listProperties = [];
              _.each(quidd.get("properties"), function(property) {
                if (!collections.controlProperties.get(quidd.get("name") + "_" + property.name) && property.writable == "true" && property.name != "started") {
                  listProperties.push(property.name);
                  quiddsMenu[quidd.get("name")] = listProperties;
                }
              });
            }
          });

          $("#listQuiddsProperties").remove();
          if (!$.isEmptyObject(quiddsMenu)) {
            var template = _.template(TemplateSubMenu, {
              type: "QuiddsAndProperties",
              menus: quiddsMenu
            });
            $(element.target).after(template);
          } else {
            views.global.notification("error", $.t("you need to create source before to add a property"));
          }
        },


        /* 
         * Called for get the list of device Midi
         */
        getMenuMidiDevice: function(element) {
          console.log("menu midi");
          $("#listDevicesMidi").remove();
          collections.classesDoc.getPropertyByClass("midisrc", "device", function(property) {
            var devicesMidi = property["values"];
            _.each(devicesMidi, function(device, index) {
              collections.quidds.each(function(quidd) {
                if (quidd.get("class") == "midisrc") {
                  _.each(quidd.get("properties"), function(property) {
                    if (property.name == "device" && property.value == device.name) delete devicesMidi[index];
                  });
                }
              });
            });

            var template = _.template(TemplateSubMenu, {
              type: "devicesMidi",
              menus: devicesMidi
            });
            $(element.target).after(template);
          });
        },

        /* 
         * add a new table for category
         */
        newCategoryTable: function(tableType, type) {
          if (tableType == this.model.get("type")) {
            /* check if already exist */
            if ($("[data-type='" + type + "']", this.el).length == 0) {
              var templateCatTable = _.template(TemplateCategory, {
                type: type
              });
              $(this.el).append(templateCatTable);
            }
          }
        },

        addCategoryFilter: function(category) {
          /* remove terms not needed*/
          category = category.replace(" source", "").replace(" sink", "");
          if ($(".dropdown_filter ." + category, this.el).length == 0) {
            $(".dropdown_filter", this.el).append("<option class='" + category + "' value='" + category + "'>" + category + "</option>")
          }
          // console.log("ask for add category filter :", category, "for the table", this.model.get("name"));
        },
        removeCategoryFilter: function(category, orientation) {
          var that = this;

          if (orientation == "source") {
            var sourceSameCat = this.model.get("collectionSources").where({
              "category": category
            }).length;
            category = category.replace(" source", "").replace(" sink", "");
            if (sourceSameCat - 1 == 0) $(".dropdown_filter ." + category).remove();
          }

          if (orientation == "destination") {
            var sourceSameCat = this.model.get("collectionDestinations").where({
              "category": category
            }).length;
            category = category.replace(" source", "").replace(" sink", "");
            if (sourceSameCat - 1 == 0) $(".dropdown_filter ." + category).remove();
          }

        },
        /* Filter Quiddities */
        filter_quiddities: function(element) {
          var that = this;
          var filterVal = $(element.target).val();
          this.model.get("collectionSources").each(function(source) {
            /* reset showing source */
            source.trigger("toggleShow", "show", that.model.get("name"));
            if (source.get("category").indexOf(filterVal) < 0) source.trigger("toggleShow", "hide", that.model.get("name"));

          });
          this.model.get("collectionDestinations").each(function(destination) {
            destination.trigger("toggleShow", "show", that.model.get("name"));
            if (destination.get("category") && destination.get("category").indexOf(filterVal) < 0) destination.trigger("toggleShow", "hide", that.model.get("name"));
          });
        }


      });

    return TableView;
  })
