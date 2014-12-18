define(
  ['config', 'switcher', 'log', 'underscore', 'jquery'],
  function(config, switcher, log, _, $) {


    var io;

    function initialize(socketIo) {
      log.debug("init Receiver for get Io");
      io = socketIo;
    }

    /**
     *  @function create
     *  @description call when a user ask to creating a quiddity
     *  @param {string} className The class of the quiddity
     *  @param {string} quiddName The name (id) of the quiddity
     *  @param {string} socketId Id Socket (socket.io) of the user ask to create the quiddity
     */

    function create(className, quiddName, socketId, cb) {


      if (!cb) cb = socketId; //its not always a user ask for create a quidd

      quiddName = (quiddName ? switcher.create(className, quiddName) : switcher.create(className));
      if (quiddName) {

        /* we stock id of socket and name of quidd because we want to alert the user 
           client side when the quiddity is created for show the properties */

        log.debug("quiddity " + quiddName + " (" + className + ") created.");

        config.listQuiddsAndSocketId[quiddName] = socketId;
        var quiddInfo = $.parseJSON(switcher.get_quiddity_description(quiddName));
        cb(null, quiddInfo);

      } else {
        log.error("failed to create a quiddity class ", className);
        cb("failed to create " + className + " maybe this name is already used?");
      }

    }


    /**
     *  @function remove
     *  @description removes the quiddity and all those associated with it (eg ViewMeter, preview, etc. ..)
     *  @param {string} quiddName The name (id) of the quiddity
     */

    function remove(quiddName) {

      if (switcher.remove(quiddName)) {
        log.debug("quiddity " + quiddName + " is removed.");
      } else {
        log.error("failed to remove " + quiddName);
      }
    }


    function removeElementsAssociateToQuiddRemoved(quiddName) {
      log.debug("remove quidds associate to quidd removed", quiddName);
      var quidds = $.parseJSON(switcher.get_quiddities_description()).quiddities;

      if (!quidds) return log.error("failed remove quiddity " + quiddName);

      removeConrolByQuiddParent(quiddName);

      /* Remove quiddity sink base on quidd removed  or vumeter */
      _.each(quidds, function(quidd) {
        if (quidd.name.indexOf(quiddName + "-sink") != -1) switcher.remove(quidd.name);
        if (quidd.name.indexOf("vumeter_") >= 0 && quidd.name.indexOf(quiddName) >= 0) switcher.remove(quidd.name);
      });


    }


    function get_description(quiddName, cb) {
      log.debug("get Description quidd", quiddName);

      var quiddDescription = $.parseJSON(switcher.get_quiddity_description(quiddName));
      log.debug(quiddDescription);
      if (quiddDescription.error) {
        cb(quiddDescription.error);
        return
      }

      cb(null, quiddDescription);
    }

    function set_property_value(quiddName, property, value, cb) {
      //check for remove shmdata when set property started to false
      if (property == "started" && value == "false") {

        //remove vumemeter associate with quiddity
        var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers"));
        if (shmdatas && !shmdatas.error) {
          shmdatas = shmdatas.shmdata_writers;
          $.each(shmdatas, function(index, shmdata) {
            log.debug("remove vumeter : vumeter_" + shmdata.path);
            switcher.remove('vumeter_' + shmdata.path);
          });
        }

        //remove shmdata of rtp
        var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers")).shmdata_writers;
        _.each(shmdatas, function(shmdata) {
          // console.log("remove data stream", shmdata.path);
          //var remove = switcher.invoke("defaultrtp","remove_data_stream", [shmdata.path]);  
        });

      }

      if (quiddName && property && value) {
        var ok = switcher.set_property_value(quiddName, property, String(value));
        if (ok) {
          var msgError = "failed to set the property " + property + " of " + quiddName;
          log.error(msgError);
          return cb(msgError);
        }

        log.debug("the porperty " + property + " of " + quiddName + "is set to " + value);
        cb(null);

        } else {
          log.error("failed to set the property " + property + " of " + quiddName);
          socket.emit("msg", "error", "the property " + property + " of " + quiddName + " is not set");
        }
      } else {
        log.error("missing arguments for set property value :", quiddName, property, value);
      }
    }


    function get_info(quiddName, path, cb) {
      log.debug("try get info of " + quiddName);
      var info = $.parseJSON(switcher.get_info(quiddName, path));
      return cb(info);
    }

    function get_property_by_class(className, propertyName, callback) {
      log.debug("try get property by class", className, propertyName);
      var propertyByClass = $.parseJSON(switcher.get_property_description_by_class(className, propertyName));

      if (propertyByClass && propertyByClass.error) {
        log.error(propertyByClass.error + "(property : " + propertyName + ", class : " + className + ")");
        return;
      }
      callback(propertyByClass);
    }


    function get_property_description(quiddName, property, callback) {

      var property_description = $.parseJSON(switcher.get_property_description(quiddName, property));
      if (property_description && property_description.error) {
        log.error(property_description.error + "(property : " + property + ", quiddity : " + quiddName + ")");
        return;
      }
      callback(property_description);
    }

    function get_properties_values(quiddName) {

      var propertiesQuidd = switcher.get_properties_description(quiddName);
      if (propertiesQuidd == "") {
        log.error("failed to get properties description of" + quiddName);
        return;
      }

      propertiesQuidd = $.parseJSON(propertiesQuidd).properties;

      //recover the value set for the properties
      $.each(propertiesQuidd, function(index, property) {
        var valueOfproperty = switcher.get_property_value(quiddName, property.name);
        if (property.name == "shmdata-writers") valueOfproperty = $.parseJSON(valueOfproperty);
        propertiesQuidd[index].value = valueOfproperty;
      });

      return propertiesQuidd;


    }

    function get_properties_description(quiddName, cb) {

      var properties_description = $.parseJSON(switcher.get_properties_description(quiddName)).properties,
      properties_to_send = {};

      if (properties_description && properties_description.error) {
        var msg = properties_description.error + "(quiddity : " + quiddName + ")";
        cb(msg);
        log.error(msg);
        return;
      }

      //re-order properties for get key = name property
      _.each(properties_description, function(property) {
        properties_to_send[property.name] = property;
      });
      cb(null, properties_to_send);
    }


    function get_methods_description(quiddName, cb) {
      var methods = $.parseJSON(switcher.get_methods_description(quiddName)).methods;
      if (!methods) {
        var msg = "failed to get methods description " + quiddName;
        cb(msg);
        log.error(msg);
        return;
      }
      var methods_to_send = {};
      _.each(methods, function(method) {
        methods_to_send[method.name] = method;
      });
      cb(null, methods_to_send);
    }

    function get_method_description(quiddName, method, cb) {
      var descriptionJson = $.parseJSON(switcher.get_method_description(quiddName, method));
      if (!descriptionJson) {
        var msg = "failed to get " + method + " method description" + quiddName;
        cb(msg, err);
        log.error(msg);
        return;
      }
      cb(null, descriptionJson);
    }



    function get_property_value(quiddName, property, cb) {
      log.debug("Get property value", quiddName, property);
      if (quiddName && property) {
        try {
          log.debug("trying to get property value")
          // property_value = $.parseJSON(switcher.get_property_value(quiddName, property));
          var property_value = $.parseJSON(switcher.get_property_value(quiddName, property));
          console.log("property value in try", property_value);
        } catch (e) {
          log.error("Error", e.stack)
          console.log(e.stack)
          var property_value = switcher.get_property_value(quiddName, property);
          console.log("property_value in catch", property_value);
          log.debug("error getting property value", e);
        }
        log.debug("getting property value seems successfull", property_value);
      } else {
        var msg = "failed o get property value (quiddity: " + quiddName + " property: " + property;
        cb(msg);
        log.error(msg);
        return;
      }
      log.debug("got this property value: ", property_value);
      cb(null, property_value);
    }


    function invoke(quiddName, method, parameters, cb) {
      var invoke = switcher.invoke(quiddName, method, parameters);
      log.debug("the method " + method + " of " + quiddName + " is invoked with " + parameters);
      if (!invoke) {
        var msgError = "failed to invoke " + quiddName + " method " + method;
        log.error(msgError);
        return cb(msgError);        
      }
      if(cb) cb(null, invoke);

      if (method == "remove_udp_stream_to_dest")
        io.sockets.emit("remove_connection", invoke, quiddName, parameters);

      //io.sockets.emit("invoke", invoke, quiddName, method, parameters);
    }

    function subscribe_info_quidd(quiddName, socketId) {
      log.debug("socketId (" + socketId + ") subscribe info " + quiddName);

      config.subscribe_quidd_info[socketId] = quiddName;
    }

    function unsubscribe_info_quidd(quiddName, socketId) {
      log.debug("socketId (" + socketId + ") unsubscribe info " + quiddName);
      delete config.subscribe_quidd_info[socketId];
    }


    //************************ DICO *****************************************//

    function set_property_value_of_dico(property, value, callback) {
      var currentValueDicoProperty = $.parseJSON(switcher.invoke("dico", "read", [property]));
      if (currentValueDicoProperty)
        currentValueDicoProperty[currentValueDicoProperty.length] = value;
      else
        var currentValueDicoProperty = [value];

      switcher.set_property_value("dico", property, JSON.stringify(currentValueDicoProperty));
      io.sockets.emit("setDicoValue", property, value);
      callback("ok");

    }

    function removeConrolByQuiddParent(quiddParent) {
      var currentValuesDicoProperty = $.parseJSON(switcher.invoke("dico", "read", ['controlProperties']));
      _.each(currentValuesDicoProperty, function(control) {
        if (control.quiddName == quiddParent) {
          remove_property_value_of_dico("controlProperties", control.name);
        }
      })
    }

    function remove_property_value_of_dico(property, name) {
      var currentValuesDicoProperty = $.parseJSON(switcher.invoke("dico", "read", property));
      var newValuesDico = [];
      _.each(currentValuesDicoProperty, function(value) {
        if (value.name != name)
          newValuesDico.push(value);
      });

      if (property == "controlProperties") {
        /* parse all quidds for remove mapper associate */
        var quidds = $.parseJSON(switcher.get_quiddities_description()).quiddities;

        /* Remove quiddity sink base on quidd removed */
        _.each(quidds, function(quidd) {
          if (quidd.name.indexOf("mapper") >= 0 && quidd.name.indexOf(name) >= 0) {
            switcher.remove(quidd.name);
          }
        });
      }

      log.debug("Remove property", property, name);

      switcher.invoke("dico", "update", [property, JSON.stringify(newValuesDico)]);
      io.sockets.emit("removeValueOfPropertyDico", property, name);
    }


    return {
      initialize: initialize,
      create: create,
      remove: remove,
      removeElementsAssociateToQuiddRemoved: removeElementsAssociateToQuiddRemoved,
      get_description: get_description,
      get_info: get_info,
      get_properties_description: get_properties_description,
      get_methods_description: get_methods_description,
      get_method_description: get_method_description,
      get_properties_values: get_properties_values,
      get_property_value: get_property_value,
      set_property_value: set_property_value,
      get_property_description: get_property_description,
      get_property_by_class: get_property_by_class,
      subscribe_info_quidd: subscribe_info_quidd,
      unsubscribe_info_quidd: unsubscribe_info_quidd,
      invoke: invoke,
      set_property_value_of_dico: set_property_value_of_dico,
      remove_property_value_of_dico: remove_property_value_of_dico
    }

  });
