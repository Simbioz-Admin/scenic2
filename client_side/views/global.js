define(

  /** 
   *  View Global
   *  Manage interaction with the Destination Model (quiddity)
   *  @exports Views/Gobal
   */
  [
    'underscore',
    'backbone',
    'text!../../templates/quidd.html',
    'text!../../templates/panelInfo.html',
    'text!../../templates/panelLoadFiles.html',
    'text!../../templates/panelSaveFile.html',
    'text!../../templates/confirmation.html',
    'text!../../templates/createReceiver.html',
    'app'
  ],

  function(_, Backbone, quiddTemplate, panelInfoTemplate, panelLoadtemplate, panelSaveTemplate, confirmationTemplate, TemplateReceiver, app) {
    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires quiddTemplate
     *  @requires panelInfoTemplate
     *  @requires confirmationTemplate
     *  @augments module:Backbone.View
     */

    var GlobalView = Backbone.View.extend(
      /**
       *  @lends module: Views/Gobal~GlobalView.prototype
       */

      {
        el: 'body',
        statePanelIrc: false,
        statePanelLog: false,

        //assocition between action on elements html and functions
        events: {
          "keypress": "keyboardAction",
          "click #close-panelRight": "closePanel",
          "click #close-panelInfoSource": "closePanelInfoSource",
          "change .checkbox": 'stateCheckbox',
          "click #btn-info": 'panelInfo',
          "click #btnSave": 'save_file',
          "submit #saveFile": 'save',
          "click #btnGetFiles": 'get_save_file',
          'click #panelFiles .file': 'load_file',
          'click .remove_save': 'remove_save',
          "click .tabTable": 'showTable',
          "touchstart .tabTable": 'showTable',
          "click #create_receiver": "create_receiver",
          "click #add-receiver": "add_receiver",
          "click  #form-destination, #form-lightbox, #panelInfo, #panelFiles,\
          #btnSave, #quiddName, #panelSave, #btnGetFiles,\
          #device, .edit": "preventPropagation"
        },

        /* Called when the view is initialized */

        initialize: function() {
          // clicking on the body would remove a floating element.
          //$('body').bind('click', this.closePanel);
          //$('body').bind('click', this.panelBoxRemove);
          var that = this;
          /** Event called when the server has a message for you */
          socket.on("msg", function(type, msg) {
            that.notification(type, msg);
          });

          /* Define the panelRight draggable */
          $("#panelRight .content, .panelInfoSource").draggable({
            cursor: "move",
            handle: "#title"
          });

          $(document).keyup(function(e) {
            that.keyboardAction(e);
          });
	  $(document).tooltip();

        },

        /* 
         * DOn't propagate events through visible elements
         */
        preventPropagation: function preventPropagation(element) {
          element.stopPropagation();
        },

        /* Function called for show a specific message in the interface */

        notification: function(type, msg) {
          var speed = 500;
          $("#msgHighLight").remove();
          $("body").append("<div id='msgHighLight' class='" + type + "'>" + msg + "</div>");
          $("#msgHighLight").animate({
            top: "50"
          }, speed, function() {
            $(this).delay(4000).animate({
              top: "-50"
            }, speed);
          });

          $("#msgHighLight").click(function() {
            $(this).remove();
          })
        },

        /* Called when we need confirmation for actions */

        confirmation: function(msg, callback) {

          if (!callback) {
            callback = msg;
            msg = "Are you sure?";
          }

          var template = _.template(confirmationTemplate, {
            msg: msg
          });
          $("body").prepend(template);
          $("#container").addClass("blur");
          $("#overlay_confirmation").animate({
            opacity: 1
          }, 100);

          $("#confirmation .btn_confirmation").on("click", function() {
            callback($(this).data("val"));
            $("#overlay_confirmation").remove();
            $("#container").removeClass("blur");

          });
          //var result = confirm(msg);
          //return result
        },


        /* Called for open the panel Right (use for edit and create quiddity) */

        openPanel: function() {
          $("#panelRight").show();
        },


        /* Called for close the panel Right  */

        closePanel: function(e) {
          $("#panelRight").hide();
          $("#panelRight").data("quiddName", "");
          /* we unsubscribe to the quiddity */

          if ($("#quiddName").val()) {
            socket.emit("unsubscribe_info_quidd", $("#quiddName").val(), socket.socket.sessionid);
          }
        },


        create_receiver: function(element) {
          //element.stopPropagation();
          var template = _.template(TemplateReceiver);
          $("#panelRight .content").html(template);
          views.global.openPanel();
        },


        add_receiver: function(e) {
          e.preventDefault();
          //e.stopPropagation();
          var destination = {
            name: $("#clientName").val(),
            hostName: $("#clientHost").val(),
            portSoap: $("#clientSoap").val()
          }

          //collections.destinations.create(name, host_name, port_soap);

          socket.emit("create_destination", destination, function(data) {
            if (data.error) {
              return views.global.notification("error", data.error);
            }
            views.global.notification("info", data.success);
            views.global.closePanel();
          });
        },


        /* here we define all action accessible with keyboard */

        keyboardAction: function(event) {
          var that = this;
          //console.log("id Key", event.which);

          /* started or stopped quidd */
          if (event.which == 115 && event.shiftKey) {
            $("#check-started").attr('checked', true);
          }

          /* action open menu for create quidd (id : 113 - up) */
          if (event.which == 81 && event.shiftKey) {
            var currentTable = localStorage['currentTable'];
            currentTable = collections.tables.get(currentTable);
            currentTable.trigger("trigger:menu", "sources");
            $("#subMenu").addClass("active");
          }

          /* action on panel (close) */
          if (event.which == 27) {
            /* Close panelRight */
            this.closePanel();

            /* close confirmation message */
            if ($("#overlay_confirmation").length > 0) {
              $("#overlay_confirmation").remove();
              $("#container").removeClass("blur");
            }

            /* Close box save/ load */
            $(".panelBox, #subMenu").remove();


          }
        },


        /*  Called for all checkbox changed
         *  To dynamically change its value
         */

        stateCheckbox: function() {
          var check = $(event.target);

          if (check.is(':checked')) check.val('true').attr('checked', true);
          else check.val('false').attr('checked', false);
        },


        save_file: function() {
          if ($("#panelSave").length == 0) {
            $(".panelBox").remove();
            var template = _.template(panelSaveTemplate, {});
            $("#btnSave").after(template);
          } else {
            $(".panelBox").remove();
          }
        },

        /* 
         *  Called for saving the current state of scenic
         */

        save: function(e) {
          e.preventDefault();
          var nameFile = $("#name_file").val(),
            that = this;

          if (nameFile.indexOf(".scenic") >= 0 || nameFile == "") {
            that.notification("error", "the name is not correct (ex : save_202) ");
            return;
          }

          console.log("ask for saving ", nameFile);
          socket.emit("save", nameFile + ".scenic", function(ok) {
            views.global.notification("info", nameFile + " is successfully saved", ok);
            $(".panelBox").remove();
          })
        },

        /* 
         *  Called for get files saved on the server
         */

        get_save_file: function() {
          var that = this;
          socket.emit('get_save_file', function(saveFiles) {
            if ($("#panelFiles").length == 0) {
              $(".panelBox").remove();
              var template = _.template(panelLoadtemplate, {
                files: saveFiles
              });
              $("#btnGetFiles").after(template);
            } else {
              $(".panelBox").remove();
            }
          });
        },

        /*
         *  Called for loading the state saved of scenic without the current state
         */

        load_file: function(e) {

          socket.emit("load", $(e.target).html(), function(ok) {
            if (ok) {

              collections.destinationsRtp.fetch({
                success: function(response) {

                  //regenerate source transfer
                  $("#sources").html("");
                  collections.quidds.fetch({
                    success: function() {
                      collections.destinationProperties.fetch();
                      views.users.render();
                    }
                  });

                }
              });
              views.global.notification("info", $(e.target).html() + " is loaded");
            }
          });
          $("#panelFiles").remove();
        },

        remove_save: function(e) {
          var name = $(e.target).data("name");
          socket.emit("remove_save", name, function(ok) {
            if (ok) {
              $(e.target).parent().remove();
            }
          })
        },

        /* Called for showing the panel of log information */

        panelLog: function() {
          var that = this;
          if (!this.statePanelLog) {
            $("#log").animate({
                "right": 0
              },
              function() {
                that.statePanelLog = true;
              });
          } else {
            $("#log").animate({
              "right": -$("#log").width() - 61
            }, function() {
              that.statePanelLog = false;
            });
          }

        },



        /* Called for showing panel Info  */

        panelInfo: function(element) {
          // element.stopPropagation();
          if ($("#panelInfo").length == 0) {
            $(".panelBox").remove();
            var template = _.template(panelInfoTemplate, {
              username: config.nameComputer,
              host: config.host,
              soap: config.port.soap
            });
            $("#btn-info").after(template);
          } else {
            $("#panelInfo").remove();
          }
        },


        /* Called for closing panel Info  */

        closePanelInfoSource: function() {
          $(".panelInfoSource").remove();
        },
        panelBoxRemove: function panelInfoRemove() {
          $(".panelBox").remove();
        },

        /* Called for switcher between the different table (control and tranfer) */

        showTable: function(event) {
          var table = $(event.target).parent().data("id");
          /* add to the local storage */
          localStorage['currentTable'] = table;
          collections.tables.currentTable = table;
          $(".tabTable").removeClass("active");
          $(event.target).parent().addClass("active");
          var target = $(event.target).attr('class')
            // if (!((target == "cpus") || (target == "cpu_info") || (target == "tabTable"))) {
            //   $("#htop").remove();
            // }
          $(".table").removeClass("active");
          $("#" + table).addClass("active");
        }
      });

    return GlobalView;
  })