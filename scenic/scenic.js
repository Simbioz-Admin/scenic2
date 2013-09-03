
module.exports = function (config, switcher, $, _, io, log)
{

	function initialize()
	{
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
		switcher.register_log_callback(function (msg)
		{
			io.sockets.emit("messageLog", msg);
			log('debug','log : ', msg);
		});

		switcher.register_prop_callback(function (qname, qprop, pvalue)
		{
			if(qprop != "byte-rate")
				log('info','...PROP...: ', qname, ' ', qprop, ' ', pvalue);
		
			io.sockets.emit("signals_properties", qname, qprop, pvalue);

			if(qprop == "shmdata-writers")
			{
				createVuMeter(qname);
				sendShmdatas(qname);
			}
		});
		
		switcher.register_signal_callback(function (qname, qprop, pvalue){
		   log("info", '...SIGNAL...: ', qname, ' ', qprop, ' ', pvalue);

		   	var quiddClass = $.parseJSON(switcher.get_quiddity_description(pvalue[0])).class;
		    if(!_.contains(config.quiddExclude, quiddClass) && qprop == "on-quiddity-created"){


		    	//we subscribe all properties of quidd created
		    	var properties = $.parseJSON(switcher.get_properties_description(pvalue[0])).properties;
				_.each(properties, function(property)
				{
					console.log("subscribe to the property", property.name);
					switcher.subscribe_to_property(pvalue[0], property.name);
				});

		    	//the socketId of the user created quidd is memories in config, we filtered for not send again "create"
		    	var socketIdCreatedThisQuidd = false;
			   _.each(config.listQuiddsAndSocketId, function(socketId, quiddName)
			   {
			   		if(quiddName == pvalue[0])
			   			socketIdCreatedThisQuidd = socketId;
			   			delete config.listQuiddsAndSocketId[quiddName];
			   });
			   	if(socketIdCreatedThisQuidd)
			   	{
					io.sockets.except(socketIdCreatedThisQuidd).emit("create", { name : pvalue[0], class : quiddClass });
			   	}
				else
				{
					io.sockets.emit("create", { name : pvalue[0], class : quiddClass });
				}

			}

		});

		log("info", "scenic is now initialize");
	}

	//create the vumeter for shmdata
	function createVuMeter(quiddName)
	{
		var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers")).shmdata_writers;
		$.each(shmdatas, function(index, shmdata)
		{
			var vumeter = switcher.create("fakesink", "vumeter_"+shmdata.path);
			var ok = switcher.invoke(vumeter, "connect", [shmdata.path]);
			switcher.subscribe_to_property(vumeter, "byte-rate");
		});
	}

	function sendShmdatas(quiddName)
	{
		var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers")).shmdata_writers;
		if(shmdatas.length > 0)
			io.sockets.emit("updateShmdatas", quiddName, shmdatas);
	}


	function remove(quidd)
	{
		//remove the vumeter
		var shmdatas = switcher.get_property_value(quidd, "shmdata-writers");
		if(shmdatas != "property not found"){
			shmdatas = $.parseJSON(shmdatas).shmdata_writers;
			$.each(shmdatas, function(index, shmdata)
			{
				//for the moment create a segmentation fault
				switcher.remove('vumeter_'+shmdata.path);

			});
		}
		return switcher.remove(quidd);
	}


	function getQuiddPropertiesWithValues(quiddName)
	{
		var propertiesQuidd = $.parseJSON(switcher.get_properties_description(quiddName)).properties;
		//recover the value set for the properties
		$.each(propertiesQuidd, function(index, property)
		{
			var valueOfproperty = switcher.get_property_value(quiddName, property.name);
			if(property.name == "shmdata-writers") valueOfproperty = $.parseJSON(valueOfproperty);
			propertiesQuidd[index].value = valueOfproperty;
		})
		return  propertiesQuidd;
	}

	function get_classes_docs_type(type)
	{
		var docsType = { classes : []};
		var docs = get_classes_docs();
		$.each(docs.classes, function(index, doc)
		{
			if(doc["category"].indexOf(type) > -1) docsType.classes.push(doc);
		});
		return docsType;
	}

	function getQuidditiesWithMethods()
	{
		var docs = $.parseJSON(switcher.get_classes_doc());
		$.each(docs.classes, function(index, classDoc)
		{
			if(classDoc["class name"] != "logger"){
				var propertyClass = $.parseJSON(switcher.get_methods_description_by_class(classDoc["class name"])).methods;
			}
			docs.classes[index].methods = propertyClass;
		});
		return docs;
	}


	function getShmdatas(){
		var shmdatas = [];
		var quiddities = $.parseJSON(switcher.get_quiddities_description()).quiddities;
		//merge the properties of quiddities with quiddities
		$.each(quiddities, function(index, quidd){

			var shmdata = switcher.get_property_value(quidd.name, "shmdata-writers");

			if(shmdata != "property not found"){
				var shmdataJson = $.parseJSON(shmdata);
				if(shmdataJson.shmdata_writers.length > 0 && quidd.class != "gstvideosrc"){
					shmdatas.push({"quiddName" : quidd.name, "paths" : shmdataJson.shmdata_writers});
				}
			}
		
		})
		return shmdatas;
	}

	return {
		initialize : initialize,
		createVuMeter : createVuMeter,
		remove : remove,
		getQuiddPropertiesWithValues : getQuiddPropertiesWithValues,
		get_classes_docs_type : get_classes_docs_type,
		getQuidditiesWithMethods : getQuidditiesWithMethods,
		getShmdatas : getShmdatas,
	}

}