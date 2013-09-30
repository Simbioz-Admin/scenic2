module.exports = function(config, switcher, $, _, io, log) {

	function initialize() {
		switcher.create("rtpsession", "defaultrtp");
		switcher.create("SOAPcontrolServer", "soap");
		switcher.invoke("soap", "set_port", [config.port.soap]);
		//create default dico for stock information
		var dico = switcher.create("dico", "dico");
		console.log(dico);
		//create the properties controlProperties for stock properties of quidds for control
		switcher.invoke(dico, "new-entry", ["controlProperties", "stock informations about properties controlable by controlers (midi, osc, etc..)", "Properties of Quidds for Controls"]);
		//var json = [{ name : "videotest_freq", quiddName : "videotest", property : "freq" },{ name : "videotest_saturation", quiddName : "videotest", property : "saturation" } ];
		//switcher.set_property_value(dico, "controlProperties", JSON.stringify(json));
		switcher.register_log_callback(function(msg) {
			//io.sockets.emit("messageLog", msg);
			log('debug', 'log : ', msg);
		});

		// switcher.create("videotestsrc");
		
		//signals for modification properties
		switcher.register_prop_callback(function(qname, qprop, pvalue) {
			if (qprop != "byte-rate") {
				log('debug', '...PROP...: ', qname, ' ', qprop, ' ', pvalue);
			}else {
				io.sockets.emit("signals_properties_value", qname, qprop, pvalue);
			}

			//broadcast all the modification on properties
			_.each(config.subscribe_quidd_info, function(quiddName, socketId) {
				if(quiddName == qname) {
					log("debug","properties send to sId ("+socketId+") "+qname+" "+qprop+" : "+pvalue);
					var socket = io.sockets.sockets[socketId];
					socket.emit("signals_properties_value", qname, qprop, pvalue);
				}
			});
			// io.sockets.emit("signals_properties_value", qname, qprop, pvalue);


			if (qprop == "shmdata-writers") {
				if($.parseJSON(pvalue).shmdata_writers.length > 0) createVuMeter(qname);
				sendShmdatas(qname);
			}
		});

		switcher.register_signal_callback(function(qname, qprop, pvalue) {
			log("info", '...SIGNAL...: ', qname, ' ', qprop, ' ', pvalue);
			console.log("info", '...SIGNAL...: ', qname, ' ', qprop, ' ', pvalue);
			var quiddClass = $.parseJSON(switcher.get_quiddity_description(pvalue[0]));
			if (!_.contains(config.quiddExclude, quiddClass.class) && qprop == "on-quiddity-created") {
				
				
				//subscribe signal for properties add/remove and methods add/remove
				switcher.subscribe_to_signal (pvalue[0], "on-new-property");
				switcher.subscribe_to_signal (pvalue[0], "on-property-removed");
				switcher.subscribe_to_signal (pvalue[0], "on-new-method");
				switcher.subscribe_to_signal (pvalue[0], "on-method-removed");

				//we subscribe all properties of quidd created
				var properties = $.parseJSON(switcher.get_properties_description(pvalue[0])).properties;
				_.each(properties, function(property) {
					switcher.subscribe_to_property(pvalue[0], property.name);
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

			if(qprop == "on-new-property" || qprop == "on-property-removed" || qprop == "on-new-method" || qprop == "on-method-removed") {
				//console.log("New property for ",qname, pvalue);
				 _.each(config.subscribe_quidd_info, function(quiddName, socketId) {
					if(quiddName == qname) {
						log("debug","send to sId ("+socketId+") "+qprop+" : "+pvalue);
						var socket = io.sockets.sockets[socketId];
						socket.emit('signals_properties_info', qprop, qname, pvalue);
					}
				});
				
			}
			//subscribe to the property added
			if(qprop == "on-new-property") {
				console.log("Subscribe ", qname, pvalue[0]);
				switcher.subscribe_to_property(qname, pvalue[0]);
			}
			//unsubscribe to the property removed
			if(qprop == "on-property-removed") {
				console.log("Unsubscribe ", qname, pvalue[0]);
				switcher.unsubscribe_to_property(qname, pvalue[0]);
			}


		});

		log("info", "scenic is now initialize");
		require('./tmp-quidds.js')(_,switcher);
	}

	//create the vumeter for shmdata

	function createVuMeter(quiddName) {

		var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers")).shmdata_writers;

		$.each(shmdatas, function(index, shmdata) {
			//remove the old vumeter just in case
			switcher.remove("vumeter_" + shmdata.path);
			var vumeter = switcher.create("fakesink", "vumeter_" + shmdata.path);

			if(!vumeter) { 
				log("error", "failed to create fakesink quiddity : ", "vumeter_" + shmdata.path);
				return false;
			} else {
				log("info", "fakesink quiddity created : ", "vumeter_" + shmdata.path);
			}

			var ok = switcher.invoke(vumeter, "connect", [shmdata.path]);
			var subscribe = switcher.subscribe_to_property(vumeter, "byte-rate");
		});
	}


	function removeVumeters(quiddName) {

		//remove the vumeter
		var shmdatas = switcher.get_property_value(quiddName, "shmdata-writers");
		if (shmdatas == "undefined" && shmdatas != "property not found") {
			shmdatas = $.parseJSON(shmdatas).shmdata_writers;
			console.log("test", shmdatas);
			$.each(shmdatas, function(index, shmdata) {
				//for the moment create a segmentation fault
				log("info", "remove vumeter : vumeter_"+shmdata.path);
				switcher.remove('vumeter_' + shmdata.path);

			});
		}
	}

	function sendShmdatas(quiddName) {

		var shmdatas = switcher.get_property_value(quiddName, "shmdata-writers");
		var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers")).shmdata_writers;

		log("info", "send Shmdatas for ", quiddName);
		io.sockets.emit("updateShmdatas", quiddName, shmdatas);
	}


	function remove(quiddName) {

		//check if another quiddities is associate to
		var quidds = $.parseJSON(switcher.get_quiddities_description()).quiddities;
		_.each(quidds, function(quidd) {
			if(quidd.name.indexOf(quiddName+"-sink") != -1) {
				switcher.remove(quidd.name);
			}
		});
		log("info", "quiddity "+quiddName+" has been removed.");
		removeVumeters(quiddName);

		return switcher.remove(quiddName);
	}




	function getQuiddPropertiesWithValues(quiddName) {

		var propertiesQuidd = switcher.get_properties_description(quiddName);
		if(propertiesQuidd != "" ) {
			propertiesQuidd = $.parseJSON(propertiesQuidd).properties;
			//recover the value set for the properties
			$.each(propertiesQuidd, function(index, property) {
				var valueOfproperty = switcher.get_property_value(quiddName, property.name);
				if (property.name == "shmdata-writers") valueOfproperty = $.parseJSON(valueOfproperty);
				propertiesQuidd[index].value = valueOfproperty;
			})
			return propertiesQuidd;
		}
	}

	function get_classes_docs_type(type) {
		var docsType = {
			classes: []
		};
		var docs = get_classes_docs();
		$.each(docs.classes, function(index, doc) {
			if (doc["category"].indexOf(type) > -1) docsType.classes.push(doc);
		});
		return docsType;
	}

	function getQuidditiesWithMethods() {
		var docs = $.parseJSON(switcher.get_classes_doc());
		$.each(docs.classes, function(index, classDoc) {
			if (classDoc["class name"] != "logger") {
				var propertyClass = $.parseJSON(switcher.get_methods_description_by_class(classDoc["class name"])).methods;
			}
			docs.classes[index].methods = propertyClass;
		});
		return docs;
	}


	function getShmdatas() {
		var shmdatas = [];
		var quiddities = $.parseJSON(switcher.get_quiddities_description()).quiddities;
		//merge the properties of quiddities with quiddities
		$.each(quiddities, function(index, quidd) {

			var shmdata = switcher.get_property_value(quidd.name, "shmdata-writers");

			if (shmdata != "property not found") {
				var shmdataJson = $.parseJSON(shmdata);
				if (shmdataJson.shmdata_writers.length > 0 && quidd.class != "gstvideosrc") {
					shmdatas.push({
						"quiddName": quidd.name,
						"paths": shmdataJson.shmdata_writers
					});
				}
			}

		})
		return shmdatas;
	}

	return {
		initialize: initialize,
		createVuMeter: createVuMeter,
		removeVumeters : removeVumeters,
		remove: remove,
		getQuiddPropertiesWithValues: getQuiddPropertiesWithValues,
		get_classes_docs_type: get_classes_docs_type,
		getQuidditiesWithMethods: getQuidditiesWithMethods,
		getShmdatas: getShmdatas,
	}

}