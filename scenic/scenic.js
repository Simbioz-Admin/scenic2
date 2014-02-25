/** 
 *
 * 	@file scenic.js: Contains all functions,
 *	signals to communicate with switcher. When the file and required
 *	by server.js we initialize different quiddities necessary for the
 *	proper functioning of scenic2
 *
 **/

/**
 * 	A module that says hello!
 * 	@module scenic
 */

module.exports = function(config, switcher, receivers, $, _, io, log) {


	/**
	 *	Initialization and creation of differents quiddities and signals
	 *	for the proper functioning of the communication between switcher and scenic2
	 */

	function initialize() {

		//create the default quiddities necessary for use switcher
		switcher.create("rtpsession", config.rtpsession);
		switcher.create("SOAPcontrolServer", "soap");

		if(config.loadFile) {
			var load = switcher.load_history_from_scratch(config.loadFile);
			if(load == "true") {
				log.info("the file ", config.loadFile, "is loaded");
			} else {
				log.error("the file " + config.loadFile + "is not found!");
			}
		} else {

			if (typeof config.port.soap == "number" && config.port.soap.toString().length == 4) {
				switcher.invoke("soap", "set_port", [config.port.soap]);
			} else {
				log.error("The soap port is not valid"+ config.port.soap);
				process.exit();
			}
			//create default dico for stock information
			var dico = switcher.create("dico", "dico");

			//create the properties controlProperties for stock properties of quidds for control
			switcher.invoke(dico, "new-entry", ["controlProperties", "stock informations about properties controlable by controlers (midi, osc, etc..)", "Properties of Quidds for Controls"]);
			switcher.invoke(dico, "new-entry", ["destinations", "stock informations about destinations for manage edition", "dico for manage destinations"]);
			switcher.set_property_value("dico", "destinations", '[]');
		}

		switcher.register_log_callback(function(msg) {
			log.switcher(msg);
		});

		//signals for modification properties
		switcher.register_prop_callback(function(qname, qprop, pvalue) {
			
			/* here we define action when a property of quidd is modified */

			//we exclude byte-reate because its call every second (almost a spam...)
			if (qprop != "byte-rate") {
				log.debug('...PROP...: ', qname, ' ', qprop, ' ', pvalue);
			} else {
				io.sockets.emit("signals_properties_value", qname, qprop, pvalue);
			}


			if(qprop == "shmdata-writers"){
				var shmdatas = $.parseJSON(pvalue).shmdata_writers;
				_.each(shmdatas, function(shm) {
					var addDataStream = switcher.invoke("defaultrtp", "add_data_stream", [shm.path]);
				});

			}

			if (qprop == "shmdata-writers") {

				//if the quidd have shmdata we create view meter
				if ($.parseJSON(pvalue).shmdata_writers.length > 0) createVuMeter(qname);
	
				//Send to all users informing the creation of shmdatas for a specific quiddity
				//var shmdatas = switcher.get_property_value(qname, "shmdata-writers");
				var shmdatas = $.parseJSON(pvalue).shmdata_writers;
				log.debug("send Shmdatas for ", qname);
				io.sockets.emit("updateShmdatas", qname, shmdatas);


				/* check if destination have shmdata in connection */
				//if(pvalue)

			}

			if(qprop == "shmdata-readers") {
				io.sockets.emit("update_shmdatas_readers", qname, pvalue);
			}


			if(qprop == "started" && pvalue == "false") {
				log.debug("remove shmdata of", qname);

				var destinations = switcher.get_property_value("dico", "destinations"),
				destinations = $.parseJSON(destinations);

				_.each(destinations, function(dest){
					_.each(dest.data_streams, function(stream){
						log.debug(stream.quiddName, qname);
						if(stream.quiddName == qname){
							log.debug("find quidd connected!", stream.path, stream.port);
							receivers.remove_connection(stream.path, dest.id);
						}
					});
				});

			}


			//broadcast all the modification on properties
			_.each(config.subscribe_quidd_info, function(quiddName, socketId) {
				if (quiddName == qname) {
					var socket = io.sockets.sockets[socketId];
					socket.emit("signals_properties_value", qname, qprop, pvalue);
				}
			});
			
		});

		switcher.register_signal_callback(function(qname, qprop, pvalue) {

			log.switcher('signal : ', qname, ' ', qprop, ' ', pvalue);
			
			var quiddClass = $.parseJSON(switcher.get_quiddity_description(pvalue[0]));
			if (!_.contains(config.quiddExclude, quiddClass.class) && qprop == "on-quiddity-created") {


				//subscribe signal for properties add/remove and methods add/remove
				switcher.subscribe_to_signal(pvalue[0], "on-property-added");
				switcher.subscribe_to_signal(pvalue[0], "on-property-removed");
				switcher.subscribe_to_signal(pvalue[0], "on-method-added");
				switcher.subscribe_to_signal(pvalue[0], "on-method-removed");
				switcher.subscribe_to_signal(pvalue[0], "on-connection-tried");

				//we subscribe all properties of quidd created

				var properties = $.parseJSON(switcher.get_properties_description(pvalue[0])).properties;
				_.each(properties, function(property) {
					switcher.subscribe_to_property(pvalue[0], property.name);
					log.switcher("subscribe to ",pvalue[0], property.name);
				});


				//the socketId of the user created quidd is memories in config, we filtered for not send again "create"
				var socketIdCreatedThisQuidd = false;
				_.each(config.listQuiddsAndSocketId, function(socketId, quiddName) {
					if (quiddName == pvalue[0])
						socketIdCreatedThisQuidd = socketId;
					delete config.listQuiddsAndSocketId[quiddName];
				});
				if (socketIdCreatedThisQuidd) {
					io.sockets.except(socketIdCreatedThisQuidd).emit("create", quiddClass);
				} else {
					io.sockets.emit("create", quiddClass);
				}

			}
			//Emits to users a quiddity is removed
			if(qprop == "on-quiddity-removed") {
				io.sockets.emit("remove", pvalue);
				log.debug("the quiddity "+ pvalue +"is removed");
			}

			if (qprop == "on-property-added" || qprop == "on-property-removed" || qprop == "on-method-added" || qprop == "on-method-removed") {
				//console.log("New property for ",qname, pvalue);
				_.each(config.subscribe_quidd_info, function(quiddName, socketId) {
					if (quiddName == qname) {
						log.switcher("send to sId (" + socketId + ") " + qprop + " : " + pvalue);
						var socket = io.sockets.sockets[socketId];
						socket.emit('signals_properties_info', qprop, qname, pvalue);
					}
				});

			}
			//subscribe to the property added
			if (qprop == "on-property-added") {
				log.switcher("Subscribe ", qname, pvalue[0]);
				switcher.subscribe_to_property(qname, pvalue[0]);
			}
			//unsubscribe to the property removed
			if (qprop == "on-property-removed") {
				log.switcher("Unsubscribe ", qname, pvalue[0]);
				switcher.unsubscribe_to_property(qname, pvalue[0]);
			}


		});

		log.debug("scenic is now initialize");
		require('./tmp-quidds.js')(_, switcher);
	}



	/**	
	 *	Creating a view meter for viewing continuously from the
	 *	interface if the video and audio streams are sent or received
	 *	@param {string} quiddName The name (id) of the quiddity
	 */

	function createVuMeter(quiddName) {
		log.debug("create vuMeter for " + quiddName);
		var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers")).shmdata_writers;

		$.each(shmdatas, function(index, shmdata) {
			//remove the old vumeter just in case
			switcher.remove("vumeter_" + shmdata.path);
			var vumeter = switcher.create("fakesink", "vumeter_" + shmdata.path);

			if (!vumeter) {
				log.error("failed to create fakesink quiddity : ", "vumeter_" + shmdata.path);
				return false;
			} else {
				log.debug("fakesink quiddity created : ", "vumeter_" + shmdata.path);
			}

			var ok = switcher.invoke(vumeter, "connect", [shmdata.path]);
			var subscribe = switcher.subscribe_to_property(vumeter, "byte-rate");
		});
	}


	/**
	 *	Remove the view meter for that we get shmdatas of the quiddity
	 *	and parse for remove each quiddity began with vumeter_+name_of_shmata
	 *	@param {string} quiddName The name (id) of the quiddity
	 */

	function removeVumeters(quiddName) {

		var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers"));

		if(shmdatas && !shmdatas.error) {
			shmdatas = shmdatas.shmdata_writers;
			$.each(shmdatas, function(index, shmdata) {
				log.debug("remove vumeter : vumeter_" + shmdata.path);
				switcher.remove('vumeter_' + shmdata.path);
			});
		}
	}


	/**
	 *	removes the quiddity and all those associated with it (eg ViewMeter, preview, etc. ..)
	 *	@param {string} quiddName The name (id) of the quiddity
	 */

	function remove(quiddName) {

		//check if another quiddities is associate to
		var quidds = $.parseJSON(switcher.get_quiddities_description()).quiddities;

		if(!quidds) {
			log.error("failed remove quiddity " + quiddName);
			return;
		}

		_.each(quidds, function(quidd) {
			if (quidd.name.indexOf(quiddName + "-sink") != -1) {
				switcher.remove(quidd.name);
			}
		});
		log.debug("quiddity " + quiddName + " has been removed.");
		removeVumeters(quiddName);
		return switcher.remove(quiddName);
	}


	/**
	 *	List all currently existing shmdatas
	 *	you can call this function by typing in a web page: http://localhost:8090/shmdatas/
	 */

	function getShmdatas() {
		var shmdatas = [];
		var quiddities = $.parseJSON(switcher.get_quiddities_description()).quiddities;

		if(!quiddities) {
			log.error("failed to get quiddities description");
			return;
		}

		//merge the properties of quiddities with quiddities
		$.each(quiddities, function(index, quidd) {

			var shmdata = switcher.get_property_value(quidd.name, "shmdata-writers");

			if(shmdata == "property not found") {
				log.error("failed to get property value of", quidd.name);
				return;
			}

			var shmdataJson = $.parseJSON(shmdata);
			// if (shmdataJson.shmdata_writers.length > 0 && quidd.class != "gstvideosrc") {
			shmdatas.push({
				"quiddName": quidd.name,
				"paths": shmdataJson.shmdata_writers
			});
			// }

		})
		return shmdatas;
	}

	function getQuiddPropertiesWithValues(quiddName) {

		var propertiesQuidd = switcher.get_properties_description(quiddName);
		if(propertiesQuidd == "") {
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

	return {
		initialize: initialize,
		createVuMeter: createVuMeter,
		removeVumeters: removeVumeters,
		remove: remove,
		getShmdatas: getShmdatas,
		getQuiddPropertiesWithValues : getQuiddPropertiesWithValues
	}

}