module.exports = function(config, scenicStart, io, switcher, scenic, $, _, log, network) {
	io.sockets.on('connection', function(socket) {

		socket.on("create", function(className, quiddName, callback) {

			var quiddName = (quiddName ? switcher.create(className, quiddName) : switcher.create(className));

			if (quiddName) {
				config.listQuiddsAndSocketId[quiddName] = socket.id;
				var quiddInfo = $.parseJSON(switcher.get_quiddity_description(quiddName));
				log.debug("quiddity "+quiddName+" ("+className+") is created.");
				callback(quiddInfo);

			} else {
				log.error("failed to create a quiddity class ", className);
				socket.emit("msg", "error", "failed to create "+className+" maybe this name is already used?");
			}
		});



		socket.on("remove", function(quiddName) {
			var quiddDelete = scenic.remove(quiddName);

			if(quiddDelete) { 
				log.debug("quiddity "+quiddName+" is removed.");
			}
			else {
				log.error("failed to remove "+quiddName);
			}
		});

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


		socket.on("setPropertyValue", function(quiddName, property, value, callback) {

			//check for remove shmdata when set property started to false
			if(property == "started" && value == "false") {
				scenic.removeVumeters(quiddName);
			}

			if(quiddName && property && value) {
				var ok = switcher.set_property_value(quiddName, property, String(value));
				if (ok) {
					log.debug("the porperty "+ property + " of " + quiddName + "is set to "+value);
					callback(property, value);
					
					//socket.broadcast.emit("setPropertyValue", quiddName, property, value);

					// if (property == "started") {
					// 	var properties = $.parseJSON(switcher.get_properties_description(quiddName)).properties;
					// 	_.each(properties, function(property) {
					// 		console.log(quiddName, property.name);
					// 		switcher.subscribe_to_property(quiddName, property.name);
					// 	});

					// }
				} else {
					log.error("failed to set the property "+ property + " of " + quiddName);
					socket.emit("msg", "error", "the property " + property + " of " + quiddName + " is not set");
				}
			} else {
				log.error("missing arguments for set property value :", quiddName, property, value);
			}
		});


		socket.on("getMethodDescription", function(quiddName, method, callback) {
			var descriptionJson = $.parseJSON(switcher.get_method_description(quiddName, method));
			callback(descriptionJson);
		});



		socket.on("getMethodsDescriptionByClass", function(quiddName, callback) {
			var methodsDescriptionByClass = $.parseJSON(switcher.get_methods_description_by_class(quiddName)).methods;
			callback(methodsDescriptionByClass);
		});


		socket.on("getMethodsDescription", function(quiddName, callback) {
			var methods = $.parseJSON(switcher.get_methods_description(quiddName)).methods;
			var methods_to_send = {};
			_.each(methods, function(method) {
				methods_to_send[method.name] = method;
			});
			callback(methods_to_send);
		});


		socket.on("getMethodsByQuidd", function(quiddName, callback) {
			var methods = $.parseJSON(switcher.get_methods_description(quiddName)).methods;
			callback(methods);
		});


		socket.on("invoke", function(quiddName, method, parameters, callback) {
			var invoke = switcher.invoke(quiddName, method, parameters);
			log.debug("the method "+method+" of "+quiddName+" is invoked with "+parameters);
			if (callback) callback(invoke);

			if (method == "add_destination")
				io.sockets.emit("add_destination", invoke, quiddName, parameters);

			if (method == "remove_destination") { 
				io.sockets.emit("remove_destination", invoke, quiddName, parameters);
				switcher.remove("soapClient-"+parameters[0]);

			}
			if (method == "add_udp_stream_to_dest")
				io.sockets.emit("add_connection", invoke, quiddName, parameters)

			if (method == "remove_udp_stream_to_dest")
				io.sockets.emit("remove_connection", invoke, quiddName, parameters);

			//io.sockets.emit("invoke", invoke, quiddName, method, parameters);
		});


		socket.on("getPropertiesOfClass", function(className, callback) {
			var propertiesofClass = $.parseJSON(switcher.get_properties_description_by_class(className)).properties;
			callback(propertiesofClass);
		});

		socket.on("getPropertyByClass", function(className, propertyName, callback) {
			try {
				var propertyByClass = $.parseJSON(switcher.get_property_description_by_class(className, propertyName));
			} catch (e) {
				var propertyByClass = "no property found";
			}
			callback(propertyByClass);
		});

		socket.on("get_property_description", function(quiddName, property, callback) {
			var property_description = $.parseJSON(switcher.get_property_description(quiddName, property));

			callback(property_description);
		});

		socket.on("get_properties_description", function(quiddName, callback) {
			var properties_description = $.parseJSON(switcher.get_properties_description(quiddName)).properties
			,	properties_to_send = {};
			//re-order properties for get key = name property
			_.each(properties_description, function(property) {
				properties_to_send[property.name] = property;
			});
			callback(properties_to_send);
		});

		socket.on("get_quiddity_description", function(quiddName, callback) {
			var quiddDescription = $.parseJSON(switcher.get_quiddity_description(quiddName));
			callback(quiddDescription);
		});

		socket.on("get_property_value", function(quiddName, property, callback) {

			if(quiddName && property) {
				try {
					var quidds = $.parseJSON(switcher.get_property_value(quiddName, property));

				} catch (e) {
					//log('debug', e);
					var quidds = switcher.get_property_value(quiddName, property);
				}
			}
			
			callback(quidds);
		});


		socket.on("subscribe_info_quidd", function(quiddName) {
			log.debug("socketId ("+socket.id+") subscribe info "+quiddName);
			config.subscribe_quidd_info[socket.id] = quiddName;
		});

		socket.on("unsubscribe_info_quidd", function(quiddName) {
			log.debug("socketId ("+socket.id+") unsubscribe info "+quiddName);
			delete config.subscribe_quidd_info[socket.id];
		});

		socket.on("disconnect", function(){
			//check if user subscribe to quidd (panel open) and close the connection
			if(config.subscribe_quidd_info[socket.id]) {
				delete config.subscribe_quidd_info[socket.id];
			}
		});


		//************************* SAUVEGARDE ****************************//


		socket.on("save", function(name, callback) {
			var save = switcher.save_history(name);
			callback(save);
		});

		socket.on("load_from_scratch", function(name, callback) {
			var load = switcher.load_history_from_scratch(name);
			callback(load);
		});

		socket.on("load_from_current_state", function(name, callback) {
			var load = switcher.load_history_from_current_state(name);
			callback(load);
		});

	});

}