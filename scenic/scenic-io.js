module.exports = function (io, scenic)
{
	io.sockets.on('connection', function (socket)
	{
		socket.on("openBrowser", function(val)
		{
			console.log("open browser");
			exec("xdg-open http://localhost:8085", puts);
		});

		socket.on("create", function(className, name, callback)
		{        
			var quiddName = scenic.create(className, name);
			console.log(quiddName);
			//switcher.subscribe_to_property (quiddName, "shmdata-writers");
			//recover the default properties with values
			var properties = scenic.getQuiddPropertiesWithValues(quiddName)
			//callback is used by the user who has created the Quidd for directly set properties 
			callback({ name : quiddName, class : className, properties : properties});
			console.log(className, name);
			if(className != "videosink")
			{
				io.sockets.emit("create", { name : quiddName, class : className, properties : properties});
			}
		});


		socket.on("remove", function(quiddName){
			console.log(quiddName);
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