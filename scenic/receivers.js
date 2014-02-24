/** 
 *
 * 	@file receveirs.js: Contains all functions,
 *	Group function for receivers, create, remove, edit etc...
 *
 **/

/**
 * 	A module manage interaction with receveir
 * 	@module scenic
 */

module.exports = function(config, switcher, $, _, io, log) {

		/*
		 *	At the create of destination we check if is not already existing in dico destination (if yes cb(exist))
		 *	If not : we add information into the dico and add destination to the rtpsession
		 *	If a soap port is define we create a quidd type controlClient and set remote url retry
		 */

		var create_destination = function(destination, cb) {

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

		}


		var connect_destination =  function(path, id, port, portSoap, cb) {


			/* 1. we need to check if the stream is already added to defaultrtp */

			var shmdataDefaultrtp = $.parseJSON(switcher.get_property_value("defaultrtp", "shmdata-readers"));


			/* 2. we associate the stream with a destination on defaultrtp */

			var addUdp = switcher.invoke("defaultrtp", "add_udp_stream_to_dest", [path, id, port]);
			if (!addUdp) return cb("error add Udp");


			/* 3. we save data stream to the dico destination */

			var destinations = $.parseJSON(switcher.get_property_value("dico", "destinations"));

			var destinations = _.map(destinations, function(destination) {

				if (destination.id == id) {
					destination.data_streams.push({
						path: path,
						port: port
					});
				}
				return destination;
			});
			var setPropertyValueOfDico = switcher.set_property_value("dico", "destinations", JSON.stringify(destinations));
			if (!setPropertyValueOfDico) return cb("error when saving Destinations Dico");


			/* 4. if a soap Port is define we set the shmdata to the httpsdpdec */

			if (portSoap != "") {
				/* need wait 1sec for update url rtp to the ControlClient */
				setTimeout(function() {
					var url = 'http://' + config.host + ':' + config.port.soap + '/sdp?rtpsession=defaultrtp&destination=' + id;
					var updateShm = switcher.invoke("soapControlClient-" + id, "invoke1", [config.nameComputer, 'to_shmdata', url]);
					if (!updateShm) return cb("error updateShm");
				}, 2000);
			}

			io.sockets.emit("add_connection", path, port, id);
			return cb(true);
		}


		var reconnect_destination = function(path, id, port, cb) {
			log.debug("reconnect destination", path, id, port);
			var addUdp = switcher.invoke("defaultrtp", "add_udp_stream_to_dest", [path, id, port]);
		}


		var remove_connection = function(path, id, cb) {

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
		}

		var update_destination =  function(oldId, destination, cb) {

			var destinations = $.parseJSON(switcher.get_property_value("dico", "destinations")),
				data_streams = destination.data_streams;

			/* 1. we remove destination */

			remove_destination(oldId, destination.portSoap, function(data) {
				if (data.error) return log.error(data.error);

				/* 2. recreate destination*/

				create_destination(destination, function(data) {
					if (data.error) return log.error(data.error);

					/* 3. Recreate the connection */
					/* SetTimeout is necessary for waiting recrate destination in client side for recreate connection after */
					setTimeout(function() {
						if (_.size(data_streams) > 0) {
							_.each(data_streams, function(stream) {

								/* 1. associate the stream with a destination on defaultrtp */

								connect_destination(stream.path, data.destination.id, stream.port, data.destination.portSoap, function(ok) {
									if (!ok) cb({
										"error": "failed to reconnect destination"
									});
								})

							});
						} else {
							return cb({
								"success": "Success update destination"
							});
						}
					}, 500);
				});

			});

		}

		var remove_destination =  function(id, portSoap, cb) {

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

		}
	
	return {
		create_destination : create_destination,
		remove_destination : remove_destination,
		connect_destination : connect_destination,
		reconnect_destination : reconnect_destination,
		update_destination : update_destination,
		remove_connection : remove_connection
	}


}