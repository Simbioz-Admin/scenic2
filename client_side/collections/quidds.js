define(

  /** 
   *  A module for creating collection of quiddities
   *  @exports collections/quidds
   */

  [
    'underscore',
    'backbone',
    'models/quidd',
  ],

  function(_, Backbone, QuiddModel) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires QuiddModel
     *  @augments module:Backbone.Collection
     */

    var QuiddsCollection = Backbone.Collection.extend(


      /**
       *  @lends module:collections/quidds~QuiddsCollection.prototype
       */

      {
        model: QuiddModel,
        url: '/quidds/',
        listEncoder: [],
        parse: function(results, xhr) {
          return results;
        },


        /** Initialization of the quidds Collection 
         *  We declare all events for receive information about quiddities
         */

        initialize: function() {
          var that = this;

          /** Event called when the server has created a quiddity */
          socket.on("create", function(quiddInfo, socketId) {
            that.create(quiddInfo);
          });

          /** Event called when the server has removed a quiddity */
          socket.on("remove", function(quidd) {
            that.delete(quidd);
            console.log("remove", quidd);
          });

          /** Event called when a signal is emitted by switcher add/remove a method or property 
           *  This event is called only if the user has the edit panel that quiddity is open
           */
          socket.on("signals_properties_info", function(prop, quiddName, value) {
            that.signalsPropertiesInfo(prop, quiddName, value);
          });


          /** Event called when the value of a property changes */
          socket.on("signals_properties_value", function(quiddName, prop, value) {
            that.signalsPropertiesUpdate(quiddName, prop, value);
          });

          /** Event called when the shmdatas of specific quidd is created */
          socket.on("updateShmdatas", function(qname, shmdatas) {
            that.updateShmdatas(qname, shmdatas);
          });

          /* Event called when a new shmdata is added */
          socket.on('addShmdata', function(qname, shmdata) {
            that.addShmdata(qname, shmdata);
          });

          socket.on('removeShmdata', function(qname, shmdata) {

            //If the shmdata is a type reader (connection) we refresh shmdata source
            if (shmdata.type == 'reader') {
              //var quiddSource = shmdata.path.split('_')[2];
              that.findQuiddByShmdata(shmdata.path, function(quidd) {
                quidd.trigger("updateConnexions");
              });
              //quidd = collections.quidds.get(quiddSource);
            }

            var quiddity = that.get(qname);
            var shmdatas = quiddity.get("shmdatasCollection");
            var shmdata = shmdatas.get(shmdata.path);
            shmdata.trigger('destroy', shmdata);

            // .delete();
          });

          /** Event called when the shmdatas readers is updated */
          socket.on("update_shmdatas_readers", function(name, shmdatas) {
            /* we parse connection for add or remove */
            // var shmdatas = $.parseJSON(shmdatas);
            $("[data-destination='" + name + "']").each(function(index, box) {
              $(box).removeClass("active");
              var path = $(box).parent().data("path");
              _.each(shmdatas, function(shm, name) {
                if (name == path) $(box).addClass("active");
              });
            });
          });
        },


        /**
         *  Delete a model quiddity
         *  This function is executed on event remove emitted by the server when switcher remove a quiddity
         *  @param {string} quiddName The name of the quiddity (id) to remove
         */

        delete: function(quiddInfo) {
          var model = this.get(quiddInfo);
          if (model) {
            model.trigger('destroy', model);
            if (quiddInfo.class != "sip") {
              views.global.notification("info", quiddInfo + " " + $.t('was deleted'));
            }
          }
        },


        /**
         *  create a model quiddity and add to the collection Quidds in client side
         *  This function is executed on event create emitted by the server when switcher create a quiddity
         *  @param {object} quiddInfo object json with information about the quiddity (name, class, etc...)
         */

        create: function(quiddInfo) {
          var model = new QuiddModel(quiddInfo);
          this.add(model);
          if (quiddInfo.class != "sip") {

            views.global.notification("info", model.get("name") + " (" + model.get("class") + ") "+$.t('is created'));
          }
          return model;
        },

        /**
         *  add/remove property or method of a specific quiddity
         *  This function is executed on event signals properties info emitted by the server when switcher add/remove method or property
         *  @param {string} prop The type of event on property or method
         *  @param {string} quiddName The name of the quiddity
         *  @param {string} name The name of the property or method
         */

        signalsPropertiesInfo: function(prop, quiddName, name) {
          var model = collections.quidds.get(quiddName);
          if (prop == "on-property-removed") {
            model.removeProperty(name[0]);
          }
          if (prop == "on-property-added") {
            model.addProperty(name[0]);
          }
          if (prop == "on-method-added") {
            console.log('on method added', name[0]);
            model.addMethod(name[0]);
          }
          if (prop == "on-method-removed") {
            model.removeMethod(name[0]);
          }
        },


        /**
         *  Update the property value of a specific quiddity
         *  This function is executed on socket event signals properties update emitted by the server when switcher update a property value.
         *  @param {string} prop The type of event on property or method
         *  @param {string} quiddName The name of the quiddity
         *  @param {string} name The name of the property or method
         *  @TODO Manage State shmdata and preview in specific QUiditty for fakeSink
         */

        signalsPropertiesUpdate: function(quiddName, prop, value) {

          /** if it's byte-rate we update directly the status of viewmeter */
          if (prop == "byte-rate") {
            var quiddNameArray = quiddName.split("_");
            var shmdata = quiddName.replace("vumeter_", "");

            quiddName = quiddNameArray[quiddNameArray.length - 2];

            // Check if referencing a SIP quiddity, temporary measure until next version of shmdata
            // vumeters for SIP quiddities are named as sipquid-<USER>, "sipquid" is defined in the server's sip.js
            var sipPrefix = 'sipquid-';
            if ( quiddName.indexOf(sipPrefix) == 0 ) {
              quiddName = quiddName.substr( 0, sipPrefix.length - 1 );
            }

            if (quiddName && collections.quidds.get(quiddName)) {
              var shmdatasCollection = collections.quidds.get(quiddName).get("shmdatasCollection");
              var shmdataModel = shmdatasCollection.get(shmdata);
              if (shmdataModel) {
                shmdataModel.set({
                  "byteRate": value
                });
              }
              //}
            }
            // views.quidds.updateVuMeter(quiddName, name);

          } else {
            var model = collections.quidds.get(quiddName);
            if (model) {
              var properties = model.get("properties");
              if (properties.length == 0) {
                model.set({
                  properties: []
                });
                model.get('properties').push({
                  name: prop,
                  value: value
                });

              } else {
                model.get("properties")[prop]["default value"] = value;
              }

              model.trigger("update:value", prop);
            }
          }
        },

        addShmdata: function(quiddName, shmdata) {
          var quidd = this.get(quiddName);
          if (quidd) {
            var shmdataCollection = quidd.get("shmdatasCollection");
            shmdataCollection.add(shmdata);
            if (shmdata.type == 'writer') {
              quidd.trigger("updateShmdatas");
            }

            if (shmdata.type == 'reader') {
              console.log(quiddName, shmdata.path);
              var quiddSource = shmdata.path.split('_')[2];
              this.findQuiddByShmdata(shmdata.path, function(quidd) {
                quidd.trigger("updateConnexions");
              });
              //quidd = collections.quidds.get(quiddSource);
            }
          }
        },

        /**
         *  Ask to the server switcher the property value of a specific quiddity
         *  @param {string} Name of the quiddity
         *  @param {string} property The name of the property
         *  @param {function} callback callback to send the value
         */

        getPropertyValue: function(quiddName, property, callback) {
          socket.emit("get_property_value", quiddName, property, function(err, propertyValue) {
            if (err) return views.global.notification('error', err);
            callback(propertyValue);
          });
        },

        /**
         *  Filter for get specific quidds of this collection
         */
        SelectQuidds: function(category) {

          var quidds = this.filter(function(quidd) {
            return quidd.get("category") == category;
          });

          return quidds;
        },

        findQuiddByShmdata: function(shmdataPath, cb) {
          collections.quidds.each(function(quidd) {
            var shmdatasCollection = quidd.get("shmdatasCollection");
            var shm = shmdatasCollection.get(shmdataPath);
            if (shm) {
              if (shm.get('type') === 'writer') {
                cb(quidd);
              }
            }
          });
        }
      });

    return QuiddsCollection;
  });