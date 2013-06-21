module.exports = function (config, io, switcher, scenic, $, _, log)
{
	io.sockets.on('connection', function (socket)
	{

		socket.on("create", function(className, name, callback)
		{        
			var quiddName = switcher.create(className, name);
			//switcher.subscribe_to_property (quiddName, "shmdata-writers");
			//recover the default properties with values

			if(!_.contains(config.quiddExclude, className))
			{
				var properties = scenic.getQuiddPropertiesWithValues(quiddName);
				var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers"));
				
				scenic.createVuMeter(shmdatas);
				//callback is used by the user who has created the Quidd for directly set properties or create encoder
				callback({ name : quiddName, class : className, properties : properties, shmdatas : shmdatas});
			}
			else
			{
				callback({ name : quiddName, class : className});
			}

			
		});

		socket.on("getConfig", function(callback)
		{
			callback(config);
		});

		socket.on("remove", function(quiddName)
		{
			var quiddDelete = scenic.remove(quiddName);
			io.sockets.emit("remove", quiddName);
		});

		socket.on("setPropertyValue", function(quiddName, property, value, callback){
			var ok = switcher.set_property_value(quiddName, property, value);
			callback(ok);
			io.sockets.emit("setPropertyValue", quiddName, property, value);
		});


		socket.on("getMethodDescription", function(quiddName, method, callback){
			var descriptionJson = $.parseJSON(switcher.get_method_description(quiddName, method));
			callback(descriptionJson);
		});


		socket.on("getMethodsDescriptionByClass", function(quiddName, callback){
			var methodsDescriptionByClass = $.parseJSON(switcher.get_methods_description_by_class(quiddName)).methods;
			callback(methodsDescriptionByClass);
		});


		socket.on("invoke", function(quiddName, method, parameters, callback){
			var invoke = switcher.invoke(quiddName, method, parameters);
			callback(invoke);
			io.sockets.emit("invoke", invoke, quiddName, method, parameters);
		});


		socket.on("getPropertiesOfClass", function(className, callback){
			var propertiesofClass =  $.parseJSON(switcher.get_properties_description_by_class(className)).properties;
			callback(propertiesofClass);
		});


		socket.on("getPropertiesOfQuidd", function(quiddName, callback){
			var propertiesOfQuidd = scenic.getQuiddPropertiesWithValues(quiddName);
			callback(propertiesOfQuidd);
		});


		socket.on("get_property_value", function(quiddName, property, callback){
			try{
				var quidds = $.parseJSON(switcher.get_property_value(quiddName, property));
				
			}
			catch(e){
				//log('info', e);
				var quidds = switcher.get_property_value(quiddName, property);
			}
			callback(quidds);
		});


		socket.on("save", function(name, callback)
		{
			var save = switcher.save_history(name);
			callback(save);
		});

		socket.on("load_from_scratch", function(name, callback)
		{
			var load = switcher.load_history_from_scratch(name);
			callback(load);
		});

		socket.on("load_from_current_state", function(name, callback)
		{
			var load = switcher.load_history_from_current_state(name);
			callback(load);
		});

	});

}