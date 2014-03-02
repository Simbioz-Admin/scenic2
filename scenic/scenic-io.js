/** 
 *
 * 	@file scenic-io.js: Contains all functions,
 *	manage the communiction between the interface <=> Server and Server <=> Switcher
 *
 **/

/**
 * 	A module that says hello!
 * 	@module scenic
 */


module.exports = function(config, scenicStart, io, switcher, scenic, receivers, $, _, log, network) {

	io.sockets.on('connection', function(socket) {

		log.debug("New user connect (socketId : " + socket.id + ")");


		/* Request by client for create a quiddity */

		socket.on("create", function(className, quiddName, callback) {

			var quiddName = (quiddName ? switcher.create(className, quiddName) : switcher.create(className));

			if (quiddName) {
				config.listQuiddsAndSocketId[quiddName] = socket.id;
				var quiddInfo = $.parseJSON(switcher.get_quiddity_description(quiddName));
				log.debug("quiddity " + quiddName + " (" + className + ") is created.");
				callback(quiddInfo);

			} else {
				log.error("failed to create a quiddity class ", className);
				socket.emit("msg", "error", "failed to create " + className + " maybe this name is already used?");
			}
		});


		/* Request by client for remove a quiddity */

		socket.on("remove", function(quiddName) {
			var quiddDelete = scenic.remove(quiddName);

			if (quiddDelete) {
				log.debug("quiddity " + quiddName + " is removed.");
			} else {
				log.error("failed to remove " + quiddName);
			}
		});

		/* Currently the dico is used for save the property of quiddity manage in  the table control */

		socket.on("setPropertyValueOfDico", function(property, value, callback) {
			var currentValueDicoProperty = $.parseJSON(switcher.get_property_value("dico", property));
			if (currentValueDicoProperty)
				currentValueDicoProperty[currentValueDicoProperty.length] = value;
			else
				var currentValueDicoProperty = [value];

			switcher.set_property_value("dico", property, JSON.stringify(currentValueDicoProperty));
			io.sockets.emit("setDicoValue", property, value);
			callback("ok");

		});

		socket.on("removeValuePropertyOfDico", function(property, name) {
			var currentValuesDicoProperty = $.parseJSON(switcher.get_property_value("dico", property));
			var newValuesDico = [];
			_.each(currentValuesDicoProperty, function(value) {
				if (value.name != name)
					newValuesDico.push(value);
			});
			switcher.set_property_value("dico", property, JSON.stringify(newValuesDico));
			io.sockets.emit("removeValueOfPropertyDico", property, name);
		});


		/* Set value property of a specific quiddity */

		socket.on("setPropertyValue", function(quiddName, property, value, callback) {

			//check for remove shmdata when set property started to false
			if (property == "started" && value == "false") {
				//remove vumemeter associate with quiddity
				scenic.removeVumeters(quiddName);
				//remove shmdata of rtp
				var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers")).shmdata_writers;
				_.each(shmdatas, function(shmdata){
					// console.log("remove data stream", shmdata.path);
					//var remove = switcher.invoke("defaultrtp","remove_data_stream", [shmdata.path]);	
				});

			}

			if (quiddName && property && value) {
				var ok = switcher.set_property_value(quiddName, property, String(value));
				if (ok) {
					log.debug("the porperty " + property + " of " + quiddName + "is set to " + value);
					callback(property, value);

				} else {
					log.error("failed to set the property " + property + " of " + quiddName);
					socket.emit("msg", "error", "the property " + property + " of " + quiddName + " is not set");
				}
			} else {
				log.error("missing arguments for set property value :", quiddName, property, value);
			}
		});


		socket.on("getMethodDescription", function(quiddName, method, callback) {
			var descriptionJson = $.parseJSON(switcher.get_method_description(quiddName, method));
			if (!descriptionJson) {
				log.error("failed to get " + method + " method description" + quiddName);
				return;
			}
			callback(descriptionJson);
		});



		socket.on("getMethodsDescriptionByClass", function(quiddName, callback) {
			var methodsDescriptionByClass = $.parseJSON(switcher.get_methods_description_by_class(quiddName)).methods;
			if (!methodsDescriptionByClass) {
				log.error("failed to get methods description by class " + quiddName);
				return;
			}
			callback(methodsDescriptionByClass);
		});


		socket.on("getMethodsDescription", function(quiddName, callback) {
			var methods = $.parseJSON(switcher.get_methods_description(quiddName)).methods;
			if (!methods) {
				log.error("failed to get methods description " + quiddName);
				return;
			}
			var methods_to_send = {};
			_.each(methods, function(method) {
				methods_to_send[method.name] = method;
			});
			callback(methods_to_send);
		});


		socket.on("getMethodsByQuidd", function(quiddName, callback) {
			var methods = $.parseJSON(switcher.get_methods_description(quiddName)).methods;
			if (!methods) {
				log.error("failed to get methods description " + quiddName);
				return;
			}
			callback(methods);
		});


		socket.on("invoke", function(quiddName, method, parameters, callback) {
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
		});


		socket.on("getPropertiesOfClass", function(className, callback) {
			try {
				var propertiesofClass = $.parseJSON(switcher.get_properties_description_by_class(className)).properties;
			} catch (e) {
				log.error("failed to get properties description by class " + className);
				return;
			}
			callback(propertiesofClass);
		});

		socket.on("getPropertyByClass", function(className, propertyName, callback) {
			log.debug("try get property by class", className, propertyName);
			var propertyByClass = $.parseJSON(switcher.get_property_description_by_class(className, propertyName));

			if (propertyByClass && propertyByClass.error) {
				log.error(propertyByClass.error + "(property : " + propertyName + ", class : " + className + ")");
				return;
			}
			callback(propertyByClass);
		});

		socket.on("get_property_description", function(quiddName, property, callback) {

			var property_description = $.parseJSON(switcher.get_property_description(quiddName, property));
			if (property_description && property_description.error) {
				log.error(property_description.error + "(property : " + propertyName + ", quiddity : " + quiddName + ")");
				return;
			}
			callback(property_description);
		});

		socket.on("get_properties_description", function(quiddName, callback) {

			var properties_description = $.parseJSON(switcher.get_properties_description(quiddName)).properties,
				properties_to_send = {};

			if (properties_description && properties_description.error) {
				log.error(properties_description.error + "(quiddity : " + quiddName + ")");
				return;
			}
			//re-order properties for get key = name property
			_.each(properties_description, function(property) {
				properties_to_send[property.name] = property;
			});
			callback(properties_to_send);
		});

		socket.on("get_quiddity_description", function(quiddName, callback) {
			try {
				var quiddDescription = $.parseJSON(switcher.get_quiddity_description(quiddName));
				callback(quiddDescription);
			} catch (e) {
				log.error("failed to get quiddity description " + quiddName);
				return;
			}
		});

		socket.on("get_property_value", function(quiddName, property, callback) {

			if (quiddName && property) {
				try {
					var quidds = $.parseJSON(switcher.get_property_value(quiddName, property));
				} catch (e) {
					var quidds = switcher.get_property_value(quiddName, property);
				}
			} else {
				log.error("failed o get property value (quiddity: " + quiddName + " property: " + property);
				return;
			}

			callback(quidds);
		});


		socket.on("subscribe_info_quidd", function(quiddName) {
			log.debug("socketId (" + socket.id + ") subscribe info " + quiddName);
			config.subscribe_quidd_info[socket.id] = quiddName;
		});

		socket.on("unsubscribe_info_quidd", function(quiddName) {
			log.debug("socketId (" + socket.id + ") unsubscribe info " + quiddName);
			delete config.subscribe_quidd_info[socket.id];
		});

		socket.on("disconnect", function() {
			//check if user subscribe to quidd (panel open) and close the connection
			if (config.subscribe_quidd_info[socket.id]) {
				delete config.subscribe_quidd_info[socket.id];
			}
		});


		//************************* DESTINATION ****************************//
		

		socket.on("create_destination", receivers.create_destination);

		socket.on("update_destination", receivers.update_destination);

		socket.on("remove_destination", receivers.remove_destination);

		socket.on("connect_destination", receivers.connect_destination);
	
		socket.on("remove_connection", receivers.remove_connection);



		//************************* SAUVEGARDE ****************************//


		socket.on("save", function(name, callback) {
			log.debug("try save scenic2");
			var save = switcher.save_history("save_files/" + name);
			callback(save);
		});

		socket.on("load_file", function(name, callback) {
			var load = switcher.load_history_from_scratch(name);
			callback(load);
		});

		socket.on("remove_file", function(name, callback) {
			var fs = require('fs');
			fs.unlink('save_files/' + name, function(err) {
				if (err) {
					log.error(err);
					return;
				}
				callback('ok');
			});

		});
		socket.on("get_save_file", function(callback) {
			var fs = require('fs');
			fs.readdir('./save_files', function(err, dir) {
				if (err) {
					log.error(err);
					return;
				}
				callback(dir);
			});
			// callback("aahaha");
		});
	});

}