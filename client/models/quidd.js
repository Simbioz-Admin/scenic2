define(

  /** 
   *  Manage all interaction between the server/views with a specific quiddity
   *  @exports Models/quidd
   */

  [
    'underscore',
    'backbone',
    'lib/socket',
    'views/source', 'views/sourceProperty', 'views/destination', 'views/mapper', 'views/editQuidd', 'models/shmdata',
  ],

  function(_, Backbone, socket, ViewSource, ViewSourceProperty, ViewDestination, ViewMapper, ViewEditQuidd, ModelShmdata) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires ViewSource
     *  @requires ViewSourceProperty
     *  @requires ViewDestination
     *  @requires ViewMapper
     *  @requires ViewEditQuidd
     *  @requires infoTemplate
     *  @augments module:Backbone.Model
     */

    var QuiddModel = Backbone.Model.extend(

      /**
       *  @lends module:Models/quidd~QuiddModel.prototype
       */

      {
        url: "/quidd/",
        idAttribute: "name",
        defaults: {
          "name": null,
          "class": null,
          "category": null,
          "long name": null,
          "description": null,
          "properties": [],
          "methods": [],
          "encoder_category": null,
          "shmdatas": null,
          "shmdatasCollection": null,
          "view": null
        },


        /**
         *  Function executed when the model quiddity is created
         *  It's used for created a view associate to the model
         *  This view need to know if it's in table controler or transfer and if it's a source or destination
         */

        initialize: function() {

          var that = this;
          var ShmdataCollection = Backbone.Collection.extend({
            model: ModelShmdata,
            comparator: function( a, b ) {
              var aSip = a.getSipUser();
              var bSip = b.getSipUser();
              if ( aSip != bSip ) {
                return aSip != null ? aSip.localeCompare(bSip) : bSip.localeCompare(aSip) * -1;
              } else {
                var aPath = a.get('path');
                var bPath = b.get('path');
                return aPath != null ? aPath.localeCompare(bPath) : ( bPath != null ? bPath.localeCompare(aPath) * -1 : 0 );
              }
            }
          });

          this.set("shmdatasCollection", new ShmdataCollection());

          socket.emit("get_info", this.get("name"), ".shmdata", function(shmdatas) {

            /* When no shmdata error = no path */
            if (!shmdatas.error && shmdatas.reader) {
              _.each(shmdatas.reader, function(shm, path) {
                shm["quidd"] = that.get("name");
                shm["path"] = path;
                shm["type"] = 'reader';
                that.get("shmdatasCollection").add(shm);
              });
            }

            /* When no shmdata error = no path */
            if (!shmdatas.error && shmdatas.writer) {
              _.each(shmdatas.writer, function(shm, path) {
                shm["quidd"] = that.get("name");
                shm["path"] = path;
                shm["type"] = 'writer';
                that.get("shmdatasCollection").add(shm);
              });
            }


            /* ViewSource it's a view for create a entry source to the table transfer */
            if (that.get("category") != "mapper" && that.get("class") != "midisrc") {
              _.each(collections.tables.models, function(tableModel) {
                /* 1. Check autorization (sources / destinations) for create view for each table */
                var authorization = tableModel.isAuthorized(that.get("class"));

                if (authorization.source) {
                  /* insert in collection */
                  tableModel.get("collectionSources").add(that);

                  /* we create a view source for table transfer and after that we create view for shmdata */
                  new ViewSource({
                    model: that,
                    table: tableModel
                  });


                }

                if (authorization.destination) {
                  /* insert in collection destination of this table */
                  tableModel.get("collectionDestinations").add(that);
                  /* Create a view */
                  new ViewDestination({
                    model: that,
                    table: tableModel
                  });
                }

              });
            }

            /* ViewSourceProperty it's a entry source for the table control */
            if (that.get("class") == "midisrc") {
              that.set("view", new ViewSourceProperty({
                model: that,
                table: "control"
              }));
            }

            /* ViewMapper it's the connection between the source and destination in table control */
            if (that.get("category") == "mapper") {
              console.log("model mapper");
              that.set("view", new ViewMapper({
                model: that,
                table: "control"
              }));
              // that.get("view").render();
            }

            var PreviewQuidd = new RegExp('^((?!(gtkvideosink|pulsesink)).)*$');
            if (!PreviewQuidd.test(that.get("name"))) {
              views.quidds.addPreviewIcon(that.get("name"));
            }


          });
        },
        updateProperties: function() {
          // console.log("update properties");
        },

        /**
         *  Allows you to create a view that contains all the information to edit the quiddity
         *  also allows to register the change in the quiddity
         */

        edit: function() {
          var that = this;

          /* We collect the latest information on the properties and method of quiddity */
          that.getProperties(function() {
            that.getMethodsDescription(function() {
              new ViewEditQuidd({
                model: that
              });
              //subscribe for have information about modification on quidd
              socket.emit("subscribe_info_quidd", that.get("name"), socket.id);
            });
          });
        },


        /**
         *  Allows to remove a specific quiddity. We also check if there are quiddity of control associated with the quiddity to also remove
         */

        askDelete: function() {
          var that = this;

          views.global.confirmation(function(ok) {
            if (ok) {
              socket.emit("remove", that.get("name"));

              /* sometimes quidd is destination and have connection need to be remove */
              $("[data-hostname='" + that.get("name") + "']").remove();

              /* check if the panel open is for the quiddity deleted */
              if (that.get("name") == $("#panelRight").data('quiddName')) {
                views.global.closePanel();
              }
            }
          });
        },


        /**
         *  Allows viewing of video quiddities type and audio
         */

        preview: function(element) {
          var path = $(element.target).closest('tr').data("path"),
            type = null,
            that = this;

          /* The information needed to create a preview is present in the vumeter create with each quiddity  */
          collections.quidds.getPropertyValue("vumeter_" + path, "caps", function(info) {
            info = info.split(",");
            if (info[0].indexOf("video") >= 0) type = "gtkvideosink";
            if (info[0].indexOf("audio") >= 0) type = "pulsesink";

            //check if the quiddity have already a preview active
            socket.emit("get_quiddity_description", type + "_" + path, function(err, quiddInfo) {
              if (err && type != null) {
                socket.emit("create", type, type + "_" + path, function(err, quiddInfo) {
                  socket.emit("invoke", quiddInfo.name, "connect", [path]);
                });
              } else {
                socket.emit("remove", type + "_" + path);
              }

            });

          });

        },

        /*
         *  Set the property value of the quiddity
         *  @param {string} property The name of the property
         *  @param {string} value The value of the property
         *  @param {function} callback Confirms that the property defined
         *  @TODO : REMOVE THIS FUNCTION FOR CALL DIRECTLY
         */

        setPropertyValue: function(property, value, cb) {
          var that = this;
          socket.emit("set_property_value", this.get("name"), property, value, function(err) {
            if (err) return views.global.notification("error", err);
            if (cb) cb("ok");
          });
        },


        /*
         *  Get and set the properties of a quiddity
         */

        getProperties: function(callback) {
          var that = this;
          socket.emit("get_properties_description", this.get("name"), function(err, properties_description) {
            if (err) views.global.notification("error", err);
            that.set("properties", properties_description);
            callback(properties_description);
          });
        },


        /*
         *  Remove a specific property
         *  This function is called by the server when a property is removed
         *  @param {string} property The name of the property
         */

        removeProperty: function(property) {
          delete this.get("properties")[property];
          /* trigger a model used to trigger a function of the view that is associated */
          this.trigger("remove:property", property);
        },


        /*
         *  Add a specific property
         *  This function is called by the server when a property is added
         *  @param {string} property The name of the property
         */

        addProperty: function(property) {
          var that = this;
          socket.emit("get_property_description", this.get("name"), property, function(description) {
            that.get("properties")[property] = description;
            /* trigger a model used to trigger a function of the view that is associated */
            that.trigger("add:property", property);
          });
        },

        /*
         *  Get description of all methods of the quiddity
         *  @param {function} callback Return the informations about methods
         */

        getMethodsDescription: function(callback) {
          var that = this;
          socket.emit("get_methods_description", this.get("name"), function(err, methodsDescription) {
            if (err) views.global.notification("error", err);
            that.set("methods", methodsDescription);
            callback(methodsDescription);
          });
        },

        /*
         *  Set a mothod of the quiddity
         *  @param {string} method Name of the method
         *  @param {array} parameters Parameters of the method
         *  @param {function} callback Confirm the method is setted
         */

        setMethod: function(method, parameters, callback) {
          socket.emit("invoke", this.get("name"), method, parameters, function(ok) {
            callback(ok);
          });
        },

        /*
         *  Add a new method of quiddity
         *  This function is called by the server when a method is added
         *  @param {string} method Name of the method
         */

        addMethod: function(method) {
          var that = this;
          socket.emit("get_method_description", this.get("name"), method, function(err, description) {
            if (err) return views.global.notification('error', err);
            that.get("methods")[method] = description;
            /* Warned the view that the method has been added */
            that.trigger("add:method", method);
          });
        },


        /*
         *  Remove a method  of quiddity
         *  This function is called by the server when a method is removed
         */

        removeMethod: function(method) {
          delete this.get("methods")[method];
          /* Warned the view that the method has been removed */
          this.trigger("remove:method", method);
        },


      });

    return QuiddModel;
  })