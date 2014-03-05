define(['config', 'node-switcher', 'log', 'underscore', 'jquery'],
    function(config, switcher, log, _, $) {

        function create(className, quiddName, callback) {

            quiddName = (quiddName ? switcher.create(className, quiddName) : switcher.create(className));
            if (quiddName) {
                //config.listQuiddsAndSocketId[quiddName] = socket.id;
                var quiddInfo = $.parseJSON(switcher.get_quiddity_description(quiddName));
                log.debug("quiddity " + quiddName + " (" + className + ") created.");
                callback(null, quiddInfo);

            } else {
                log.error("failed to create a quiddity class ", className);
                callback("failed to create " + className + " maybe this name is already used?");
            }

        }


        /**
         *  removes the quiddity and all those associated with it (eg ViewMeter, preview, etc. ..)
         *  @param {string} quiddName The name (id) of the quiddity
         */

        function remove(quiddName) {

            var quidds = $.parseJSON(switcher.get_quiddities_description()).quiddities;

            if (!quidds) return log.error("failed remove quiddity " + quiddName);

            _.each(quidds, function(quidd) {
                if (quidd.name.indexOf(quiddName + "-sink") != -1) {
                    switcher.remove(quidd.name);
                }
            });

            if (switcher.remove(quiddName)) {
                log.debug("quiddity " + quiddName + " is removed.");
            } else {
                log.error("failed to remove " + quiddName);
            }
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
                    log.debug("the porperty " + property + " of " + quiddName + "is set to " + value);
                    cb(property, value);

                } else {
                    log.error("failed to set the property " + property + " of " + quiddName);
                    socket.emit("msg", "error", "the property " + property + " of " + quiddName + " is not set");
                }
            } else {
                log.error("missing arguments for set property value :", quiddName, property, value);
            }
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


        function get_methods_description(quiddName, callback) {
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
            callback(null, methods_to_send);
        }

        function get_method_description(quiddName, method, callbackcb) {
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

            if (quiddName && property) {
                try {
                    var property_value = $.parseJSON(switcher.get_property_value(quiddName, property));
                } catch (e) {
                    var property_value = switcher.get_property_value(quiddName, property);
                }
            } else {
                var msg = "failed o get property value (quiddity: " + quiddName + " property: " + property;
                cb(msg);
                log.error(msg);
                return;
            }

            cb(null, property_value);
        }


        function invoke(quiddName, method, parameters, callback) {
            var invoke = switcher.invoke(quiddName, method, parameters);
            log.debug("the method " + method + " of " + quiddName + " is invoked with " + parameters);
            if (!invoke) {
                log.error("failed to invoke " + quiddname + " method " + method);
                return;
            }
            if (callback) callback(invoke);

            if (method == "remove_udp_stream_to_dest")
                io.sockets.emit("remove_connection", invoke, quiddName, parameters);

            //io.sockets.emit("invoke", invoke, quiddName, method, parameters);
        }

        return {
            create: create,
            remove: remove,
            get_description: get_description,
            get_properties_description: get_properties_description,
            get_methods_description: get_methods_description,
            get_methods_description: get_methods_description,
            get_properties_values: get_properties_values,
            get_property_value: get_property_value,
            set_property_value: set_property_value,
            invoke: invoke
        }

    }
);