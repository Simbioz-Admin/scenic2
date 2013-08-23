
module.exports = function (config, switcher, $, _, io, log)
{

	function initialize()
	{
		switcher.create("rtpsession", "defaultrtp");
		switcher.create("SOAPcontrolServer", "soap");
		switcher.invoke("soap", "set_port", [config.port.soap]);

		switcher.register_log_callback(function (msg)
		{
			io.sockets.emit("messageLog", msg);
			log('debug','log : ', msg);
		});

		switcher.register_prop_callback(function (qname, qprop, pvalue)
		{
			log('info','...PROP...: ', qname, ' ', qprop, ' ', pvalue);
			io.sockets.emit("signals_properties", qname, qprop, pvalue);

			if(qprop == "shmdata-writers")
			{
				createVuMeter($.parseJSON(pvalue));
				sendShmdatas(qname);
			}
		});
		
		switcher.register_signal_callback(function (qname, qprop, pvalue){
		   log("debug", '...SIGNAL...: ', qname, ' ', qprop, ' ', pvalue);
		    
	    	var quiddClass = $.parseJSON(switcher.get_quiddity_description(pvalue[0])).class;
	    	

		    if(!_.contains(config.quiddExclude, quiddClass) && qprop == "on-quiddity-created")
		    {
		    	//io.sockets.emit("create", { name : pvalue[0], class : quiddClass});
				sendShmdatas(pvalue[0]);
			    //subscrire to shmdata-writers proprety for create byte-rate
			    switcher.subscribe_to_property(pvalue[0], "shmdata-writers");

				    
			    setTimeout(function(){
					var shmdatas = $.parseJSON(switcher.get_property_value(pvalue[0], "shmdata-writers")).shmdata_writers;
			    }, 1000)
			    
		    }
		});

		log("info", "scenic is now initialize");
	}

	//create the vumeter for shmdata
	function createVuMeter(shmdatas)
	{
		$.each(shmdatas["shmdata_writers"], function(index, shmdata)
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
		var shmdatas = $.parseJSON(switcher.get_property_value(quidd, "shmdata-writers")).shmdata_writers;
		$.each(shmdatas, function(index, shmdata)
		{
			console.log("remove vumeter", 'vumeter_'+shmdata.path);
			//for the moment create a segmentation fault
			switcher.remove('vumeter_'+shmdata.path);

		});

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