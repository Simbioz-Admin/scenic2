
module.exports = function (config, $, _, soap_port, io)
{
	var switcher = require('node-switcher');

	switcher.register_log_callback(function (msg)
	{
			io.sockets.emit("messageLog", msg);
			//console.log('log : ', msg);
	 });

	switcher.register_prop_callback(function (qname, qprop, pvalue)
	{
		//console.log('...PROP...: ', qname, ' ', qprop, ' ', $.parseJSON(pvalue));
		if(qprop == "shmdata-writers")
		{
			createVuMeter($.parseJSON(pvalue));
			var shmdatas = $.parseJSON(switcher.get_property_value(qname, "shmdata-writers")).shmdata_writers;
			io.sockets.emit("updateShmdatas", qname, qprop, shmdatas);
			switcher.unsubscribe_to_property(qname, qprop);
		}
		io.sockets.emit("signals_properties", qname, qprop, pvalue);
	});
	
	switcher.register_signal_callback(function (qname, qprop, pvalue){
	    console.log('...SIGNAL...: ', qname, ' ', qprop, ' ', pvalue);
	    
    	var quiddClass = $.parseJSON(switcher.get_quiddity_description(pvalue[0])).class;
    	
	    if(!_.contains(config.quiddExclude, quiddClass) && qprop == "on-quiddity-created")
	    {
			var shmdatas = $.parseJSON(switcher.get_property_value(pvalue[0], "shmdata-writers")).shmdata_writers;
	    	io.sockets.emit("create", { name : pvalue[0], class : quiddClass, shmdatas : shmdatas});
		    //subscrire to shmdata-writers proprety for create byte-rate
		    switcher.subscribe_to_property (pvalue[0], "shmdata-writers");
	    }

	    
	});

	switcher.create("rtpsession", "defaultrtp");
	switcher.create("SOAPcontrolServer", "soap");
	switcher.invoke("soap", "set_port", [soap_port]);


	//TODO : find way to acces function in return
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


	return {
		create : function(quidd, name)
		{
			var name = switcher.create(quidd, name);
			return name;
		},
		remove : function(quidd)
		{
			//remove the vumeter
			shmdatas = $.parseJSON(switcher.get_property_value(quidd, "shmdata-writers")).shmdata_writers;
			$.each(shmdatas, function(index, shmdata)
			{
				//for the moment create a segmentation fault
				//switcher.remove('vumeter_'+shmdata.path);
			});

			return switcher.remove(quidd);
		},
		set_property_value : function(quiddName, property, value)
		{
			return switcher.set_property_value(quiddName, property, value);
		},
		invoke : function(quiddName, method, parameters)
		{
			return switcher.invoke(quiddName, method, parameters);
		},
		get_classes_docs : function(){
			var docs = $.parseJSON(switcher.get_classes_doc());
			return docs;
		},
		get_property_description_by_class : function(nameClass, property){
			var properties = $.parseJSON(switcher.get_property_description_by_class(nameClass, property));
			return properties;
		},

		getQuidds : function(){
			var quidds =  $.parseJSON(switcher.get_quiddities_description()).quiddities;
			return quidds;
		},

		get_classes_docs : function(){
			var docs = $.parseJSON(switcher.get_classes_doc());
			return docs;
		},

		get_classes_docs_type : function(type){
			var docsType = { classes : []};
			var docs = get_classes_docs();
			$.each(docs.classes, function(index, doc)
			{
				if(doc["category"].indexOf(type) > -1) docsType.classes.push(doc);
			});
			return docsType;
		},

		get_class_doc : function(className){
			var doc = $.parseJSON(switcher.get_class_doc(className));
			return doc;
		},

		get_properties_description_by_class : function(nameClass){
			var properties = $.parseJSON(switcher.get_properties_description_by_class(nameClass));
			return properties;
		},

		get_property_description_by_class : function(nameClass, property){
			var properties = $.parseJSON(switcher.get_property_description_by_class(nameClass, property));
			return properties;
		},

		get_property_value : function(nameClass, property){
			var property = $.parseJSON(switcher.get_property_value(nameClass, property));
			return property;
		},

		get_methods_description_by_class : function(nameClass){
			var methods = $.parseJSON(switcher.get_methods_description_by_class(nameClass));
			return methods;
		},

		get_method_description_by_class : function(nameClass, method){
			var method = $.parseJSON(switcher.get_method_description_by_class(nameClass, method));
			return method;
		},

		get_quiddity_description : function(nameQuidd){
			var quidd = $.parseJSON(switcher.get_quiddity_description(nameQuidd));
			return quidd;
		},

		get_properties_description : function(nameQuidd){
			var properties = $.parseJSON(switcher.get_properties_description(nameQuidd));
			return properties
		},

		get_property_description : function(nameQuidd, property){
			var property = $.parseJSON(switcher.get_property_description(nameQuidd, property));
			return property
		},

		get_methods_description : function(nameQuidd){
			var methods = $.parseJSON(switcher.get_methods_description(nameQuidd));
			return methods
		},

		get_method_description : function(nameQuidd, method){
			var method = $.parseJSON(switcher.get_method_description(nameQuidd, method));
			return method
		},
		subscribe_to_property : function(nameQuidd, property){
			var ok = switcher.subscribe_to_property(nameQuidd, property);
			return ok;
		},
		list_subscribed_properties : function(){
			return switcher.list_subscribed_properties();
		},
		// merge properties of classes with ClassesDoc
		getClassesDocWithProperties : function(){
			var docs = $.parseJSON(switcher.get_classes_doc());
			$.each(docs.classes, function(index, classDoc){;
				var propertyClass = $.parseJSON(switcher.get_properties_description_by_class(classDoc["class name"])).properties;
				docs.classes[index].properties = propertyClass;
			});
			return docs;
		},
		getQuidditiesWithMethods : function(){
			var docs = $.parseJSON(switcher.get_classes_doc());
			$.each(docs.classes, function(index, classDoc){;
				if(classDoc["class name"] != "logger"){
					var propertyClass = $.parseJSON(switcher.get_methods_description_by_class(classDoc["class name"])).methods;
				}

				docs.classes[index].methods = propertyClass;
			});
			return docs;
		},
		getQuidditiesWithPropertiesAndValues : function(){
			//recover the quiddities already existing 
			var quiddities = $.parseJSON(switcher.get_quiddities_description()).quiddities;
			//merge the properties of quiddities with quiddities
			$.each(quiddities, function(index, quidd){      
				quiddities[index].properties = getQuiddPropertiesWithValues(quidd.name);
			})
			return quiddities;
		},
		getQuiddPropertiesWithValues : function(quiddName){
			var propertiesQuidd = $.parseJSON(switcher.get_properties_description(quiddName)).properties;
			//recover the value set for the properties
			$.each(propertiesQuidd, function(index, property){
				
				var valueOfproperty = switcher.get_property_value(quiddName, property.name);
				if(property.name == "shmdata-writers"){ 
					valueOfproperty = $.parseJSON(valueOfproperty);
				} 
				propertiesQuidd[index].value = valueOfproperty;
				
			})
			return  propertiesQuidd;
		},
		getShmdatas : function(){
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
		},
		createVuMeter : function(shmdatas)
		{
			createVuMeter(shmdatas);
		}
	}



}