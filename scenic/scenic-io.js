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
				//remove vumemeter associate with quiddity
				scenic.removeVumeters(quiddName);
				//remove shmdata of rtp
				var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers")).shmdata_writers;
				_.each(shmdatas, function(shmdata){
					console.log("remove data stream", shmdata.path);
					var remove = switcher.invoke("defaultrtp","remove_data_stream", [shmdata.path]);	
					console.log("remove", remove);
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
			var uuid = require('node-uuid');
			destination["id"] = uuid.v1();
			destination['data_streams'] = [];
			destination.hostName = destination.hostName.replace("http://", "");
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


				/* 1. we create a SOAPControlClient for talk to te other scenic */

				if (destination.hostName.indexOf("http://") < 0) destination.hostName = "http://" + destination.hostName;

				var addressClient = destination.hostName + ":" + destination.portSoap
				,	createSoapClient = switcher.create("SOAPcontrolClient", "soapControlClient-" + destination.id);

				if (!createSoapClient) {
					var msg = "Failed to create Quiddity " + destination.id;
					log.error(msg);
					return cb({
						error: msg
					});
				}

				/* 2. we set url of client on quidd SOAPControlClient */

				var setUrl = switcher.invoke("soapControlClient-" + destination.id, "set_remote_url_retry", [addressClient]);
				if (!setUrl) {
					var msg = "Failed to set the method set_remote_url_retry for " + destination.id;
					log.error(msg);
					return cb({
						error: msg
					});
				}

				/* 3. we try to create soapClient on the client scenic */

				var CreateHttpsdpdec = switcher.invoke("soapControlClient-" + destination.id, "create", ["httpsdpdec", config.nameComputer]);
				log.info("Quidds httpsdpdec created?", CreateHttpsdpdec);

			}

			/* callback success create destination */
			cb({
				destination : destination,
				success: "The destination " + destination.name + " is added"
			});
			/* Send all creation of destination */
			io.sockets.emit("create_destination", destination);

		};

		/* Called when user ask to remove a destination 
		 * In first step we remove destination to the rtpsession  and after that to the dico */


		socket.on("remove_destination", remove_destination);

		function remove_destination(id, portSoap, cb) {

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
			if (portSoap != "") {
				var removeSoapClient = switcher.invoke("soapControlClient-" + id, "remove", [config.nameComputer]);
				var removeCOntrolCLient = switcher.remove("soapControlClient-" + id);
			}

			/* remove destination of the dico */
			var destinations = $.parseJSON(switcher.get_property_value("dico", "destinations"));
			var destinationsWhitout = _.reject(destinations, function(dest) {
				return dest.id == id;
			});
			var setDicoWithout = switcher.set_property_value("dico", "destinations", JSON.stringify(destinationsWhitout));
			if (!setDicoWithout) {
				var msg = "Failed to set destination ",
					id;
				log.error(msg);
				return cb({
					error: msg
				});
				log.info("success to remove destination", id);
			}

			cb({
				sucess: "sucess remove destination"
			});
			/* Alert all destination has been removed */
			io.sockets.emit("remove_destination", id);

		};



		socket.on("update_destination", update_destination);

		function update_destination(oldId, destination, cb) {
			var destinations = $.parseJSON(switcher.get_property_value("dico", "destinations"));
			var data_streams = destination.data_streams;

			/* 1. we remove destination */

			remove_destination(oldId, destination.portSoap, function(data) {
				if (data.error) return log.error(data.error);

				/* 2. recreate destination*/

				create_destination(destination, function(data) {
					if (data.error) return log.error(data.error);

					/* 3. Recreate the connection */
					/* SetTimeout is necessary for waiting recrate destination in client side for recreate connection after */
					setTimeout(function(){
						if(_.size(data_streams) > 0){
							_.each(data_streams, function(stream) {

								/* 1. associate the stream with a destination on defaultrtp */

								connect_destination(stream.path, data.destination.id, stream.port, data.destination.portSoap, function(ok) {
									if(!ok) cb({"error" : "failed to reconnect destination"});
								})
							
							});
						} else {
							return cb({"success" :  "Success update destination" });
						}
					}, 500);
				});

			});




		};w



		socket.on("connect_destination", connect_destination);
	
		function connect_destination(path, id, port, portSoap, cb) {


			/* 1. we need to check if the stream is already added to defaultrtp */

			var shmdataDefaultrtp = $.parseJSON(switcher.get_property_value("defaultrtp", "shmdata-readers"));


			// if(!_.findWhere(shmdataDefaultrtp.shmdata_readers, {path : path})) {
			// 	/* we add the path to the defaultrtp */
			// 	// var addDataStream = switcher.invoke("defaultrtp", "add_data_stream", [path]);
			// 	if (!addDataStream) return cb("error add data stream");
			// }


			/* 2. we associate the stream with a destination on defaultrtp */

			var addUdp = switcher.invoke("defaultrtp", "add_udp_stream_to_dest", [path, id, port]);
			if (!addUdp) return cb("error add Udp");

			
			/* 3. we save data stream to the dico destination */

			var destinations = $.parseJSON(switcher.get_property_value("dico", "destinations"));

			var destinations = _.map(destinations, function(destination) {

				if(destination.id == id) {
					destination.data_streams.push({ path : path, port : port});
				}
				return destination;
			});
			var setPropertyValueOfDico = switcher.set_property_value("dico", "destinations", JSON.stringify(destinations));
			if(!setPropertyValueOfDico) return cb("error when saving Destinations Dico");


			/* 4. if a soap Port is define we set the shmdata to the httpsdpdec */

			if (portSoap != "") {
				/* need wait 1sec for update url rtp to the ControlClient */
				setTimeout(function(){
					var url = 'http://' + config.host + ':' + config.port.soap + '/sdp?rtpsession=defaultrtp&destination=' + id;
					var updateShm = switcher.invoke("soapControlClient-" + id, "invoke1", [config.nameComputer, 'to_shmdata', url]);
					if (!updateShm) return cb("error updateShm");
				},2000);
			}

			io.sockets.emit("add_connection", path, port, id);
			return cb(true);
		};

		socket.on("remove_connection", function(path, id, cb) {

			/* 1. remove the association between shmdata and destination */

			var remove = switcher.invoke("defaultrtp", "remove_udp_stream_to_dest", [path, id]);
			if(!remove) return cb("Error to remove udp stream to destination");
			//var removeData = switcher.invoke("defaultrtp","remove_data_stream", [path]);


			/* 3. we remove data stream to the dico destination */

			var destinations_rtp = $.parseJSON(switcher.get_property_value("defaultrtp", "destinations-json")).destinations;

			var destination_rtp = _.findWhere(destinations_rtp , { name : id });

			var destDico = switcher.get_property_value("dico", "destinations");
			var destinations_dico = JSON.parse(switcher.get_property_value("dico", "destinations"));

			destinations_dico = _.map(destinations_dico, function(dest) {
				if(dest.id == id) dest.data_streams = destination_rtp.data_streams;
				return dest;
			});

			var setPropertyValueOfDico = switcher.set_property_value("dico", "destinations", JSON.stringify(destinations_dico));
			if(!setPropertyValueOfDico) return cb("error when saving Destinations Dico");


			io.sockets.emit("remove_connection", path, id);
			//var url = 'http://' + config.host + ':' + config.port.soap + '/sdp?rtpsession=defaultrtp&destination=' + id;
			//var updateShm = switcher.invoke("soapControlClient-" + id, "invoke1", [config.nameComputer, 'to_shmdata', url]);
			cb(remove);
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