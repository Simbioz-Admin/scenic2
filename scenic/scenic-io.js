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


module.exports = function(config, scenicStart, io, switcher, scenic, $, _, log, network) {

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
				scenic.removeVumeters(quiddName);
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

			// if (method == "add_destination")
			// 	io.sockets.emit("add_destination", invoke, quiddName, parameters);

			if (method == "remove_destination") {
				io.sockets.emit("remove_destination", invoke, quiddName, parameters);
				switcher.remove("soapClient-" + parameters[0]);

			}
			if (method == "add_udp_stream_to_dest")
				io.sockets.emit("add_connection", invoke, quiddName, parameters)

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
			console.log("prop", switcher.get_property_description_by_class(className, propertyName));
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


		/*
		 *	At the create of destination we check if is not already existing in dico destination (if yes cb(exist))
		 *	If not : we add information into the dico and add destination to the rtpsession
		 *	If a soap port is define we create a quidd type controlClient and set remote url retry
		 */

		socket.on("create_destination", create_destination);

		function create_destination(destination, cb) {

			var destinations = switcher.get_property_value("dico", "destinations"),
				destinations = $.parseJSON(destinations),
				exist = _.findWhere(destinations, {
					name: destination.name
				});


			/* define a id before create client side */
			destination["id"] = _.uniqueId("destination");

			if (destination.hostName.indexOf("http://") < 0) destination.hostName = "http://" + destination.hostName;

			if (exist) {
				return cb({
					error: "the destination already exists"
				});
				log.warn("destination with the name " + destination.hostName + "already exists");
			}


			destinations.push(destination);
			var setDestination = switcher.set_property_value("dico", "destinations", JSON.stringify(destinations));
			if (!setDestination) {
				var msg = "Failed to set property destination for add " + destination.hostName;
				log.error(msg);
				return cb({
					error: msg
				});
			}

			/* add the destination to the quiddity rtpsession */

			log.info("add to rtpdefault", destination.id);
			var addToRtpSession = switcher.invoke("defaultrtp", "add_destination", [destination.id, destination.hostName]);

			if (!addToRtpSession) {
				var msg = "Failed to add the destination to the quidd RTPSession";
				log.error(msg);
				return cb({
					error: msg
				});
			}

			/* if port SOAP define we create a quiddity for communiate with the other scenic machine */
			if (destination.portSoap) {
				log.info("Soap Define, we create quiddity for ");
				// var soapClient = "soapClient-" + destination.id,
				var	addressClient = destination.hostName + ":" + destination.portSoap;

				var createSoapClient = switcher.create("SOAPcontrolClient", "control-"+destination.id);
				if (!createSoapClient) {
					var msg = "Failed to create Quiddity " + destination.id;
					log.error(msg);
					return cb({
						error: msg
					});
				}

				var setUrl = switcher.invoke("control-"+destination.id, "set_remote_url_retry", [addressClient]);
				if (!setUrl) {
					var msg = "Failed to set the method set_remote_url_retry for " + destination.id;
					log.error(msg);
					return cb({
						error: msg
					});
				}

				/* we try to create soapClient on the server remote */
				var CreateHttpsdpdec = switcher.invoke("control-"+destination.id, "create", ["httpsdpdec", config.nameComputer]);
				log.info("Quidds httpsdpdec created?", CreateHttpsdpdec);

			}

			/* callback success create destination */
			cb({
				success: "The destination " + destination.name + " is added"
			});
			/* Send all creation of destination */ 
			io.sockets.emit("create_destination", destination);

		};

		/* Called when user ask to remove a destination 
		 * In first step we remove destination to the rtpsession  and after that to the dico */


		socket.on("remove_destination", remove_destination);

		function remove_destination(id, cb) {

			log.info("ASK for remove", id);

			var removeToRtp = switcher.invoke("defaultrtp", "remove_destination", [id]);
			if (!removeToRtp) {
				var msg = "Failed to remove destination " + id;
				log.error(msg);
				return cb({
					error: msg
				});
			}

			/* Remove SoapClient to the destination with port SOAP */
			var removeSoapClient = switcher.invoke("control-"+id, "remove", [config.nameComputer]);
			var removeCOntrolCLient = switcher.remove("control-"+id);

			/* remove destination of the dico */
			var destinations = $.parseJSON(switcher.get_property_value("dico", "destinations"));
			var destinationsWhitout = _.reject(destinations, function(dest) {
				return dest.id == id;
			});
			var setDicoWithout = switcher.set_property_value("dico", "destinations", JSON.stringify(destinationsWhitout));
			if (!setDicoWithout) {
				var msg = "Failed to set destination ", id;
				log.error(msg);
				return cb({
					error: msg
				});
				log.info("success to remove destination", id);
			}

			cb({sucess : "sucess remove destination"});
			/* Alert all destination has been removed */
			io.sockets.emit("remove_destination", id);

		};

		socket.on("update_destination", function(oldId, destination, cb) {
			var destinations = $.parseJSON(switcher.get_property_value("dico", "destinations"));
			
			/* first we remove destination */
			remove_destination(oldId, function(data) {
				if (data.error) return log.error(data.error);
				create_destination(destination, function(data) {
					if (data.error) return log.error(data.error);
					cb({success : "success update destination"});
				})
			});

		});


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