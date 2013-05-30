module.exports = function (config, io, scenic, $, _)
{
	io.sockets.on('connection', function (socket)
	{

		socket.on("create", function(className, name, callback)
		{        
			var quiddName = scenic.create(className, name);
			//switcher.subscribe_to_property (quiddName, "shmdata-writers");
			//recover the default properties with values
			var properties = scenic.getQuiddPropertiesWithValues(quiddName);
			var shmdatas = scenic.get_property_value(quiddName, "shmdata-writers");

			scenic.createVuMeter(shmdatas);

			//callback is used by the user who has created the Quidd for directly set properties or create encoder
			callback({ name : quiddName, class : className, properties : properties, shmdatas : shmdatas});

			// if(!_.contains(config.quiddExclude, className))
			// {
			// 	io.sockets.emit("create", { name : quiddName, class : className, properties : properties});
			// }
			
		});


		socket.on("remove", function(quiddName){
			var quiddDelete = scenic.remove(quiddName);

			io.sockets.emit("remove", quiddName);
		});


		socket.on("setPropertyValue", function(quiddName, property, value, callback){
			var ok = scenic.set_property_value(quiddName, property, value);
			callback(ok);
			io.sockets.emit("setPropertyValue", quiddName, property, value);
		});


		socket.on("getMethodDescription", function(quiddName, method, callback){
			var descriptionJson = scenic.get_method_description(quiddName, method);
			callback(descriptionJson);
		});


		socket.on("getMethodsDescriptionByClass", function(quiddName, callback){
			var methodsDescriptionByClass = scenic.get_methods_description_by_class(quiddName).methods;
			callback(methodsDescriptionByClass);
		});


		socket.on("invoke", function(quiddName, method, parameters, callback){
			var invoke = scenic.invoke(quiddName, method, parameters);
			callback(invoke);
			io.sockets.emit("invoke", invoke, quiddName, method, parameters);
		});


		socket.on("getPropertiesOfClass", function(className, callback){
			var propertiesofClass = scenic.get_properties_description_by_class(className).properties;
			callback(propertiesofClass);
		});


		socket.on("getPropertiesOfQuidd", function(quiddName, callback){
			var propertiesOfQuidd = scenic.getQuiddPropertiesWithValues(quiddName);
			callback(propertiesOfQuidd);
		});


		socket.on("getQuidditiesWithPropertiesAndValues", function(quiddName, callback){
			var QuidditiesWithPropertiesAndValues = scenic.getQuidditiesWithPropertiesAndValues(quiddName);
			callback(QuidditiesWithPropertiesAndValues);
		});

		socket.on("get_property_value", function(quiddName, property, callback){
			var quidds = scenic.get_property_value(quiddName, property);
			callback(quidds);
		});


	});

}