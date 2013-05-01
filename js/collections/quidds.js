define([
	'underscore',
	'backbone',
	'models/quidd',
	'views/quidd',
	],function(_, Backbone, QuiddModel, QuiddsView){

		var QuiddsCollection = Backbone.Collection.extend({
			model : QuiddModel,
			url : '/quidds/',
			parse : function(results, xhr)
			{
				//exclude specific node not use in interface
				var quidds = [];
				_.each(results, function(quidd)
				{
					if(quidd.class != "rtpsession" && quidd.class != "logger" && quidd.class != "runtime" && quidd.class != "logger" && quidd.class != "SOAPcontrolServer" )
					{
						quidds.push(quidd);
					}
				})
		        return quidds;

		    },
		    initialize : function()
		    {
		    	console.log("init collection quidds");
		    	that = this;

		    	//receive notification for add quidd to the collection Quidds
		    	socket.on("create", function(quidd, properties)
		    	{
		    		var model = new QuiddModel(quidd);
		    		that.add(model);

		    	});

		    	socket.on("remove", function(quiddName){
		    		that.remove(quiddName);
		    	});

		    	//receive notification for set property of quidd
		    	socket.on("setPropertyValue", function(nameQuidd, property, value)
		    	{
		    		var quidd = that.get(nameQuidd);
		    		//quidd.get("properties")

		    		_.each(quidd.get("properties"), function(prop, index)
		    		{
		    			if(prop.name == property) quidd.get("properties")[index]["value"] = value;		
		    		});
		    	});
		    },
		    create : function(className, name, callback){

		    	//ask for create a Quidd
		    	socket.emit("create", className, name, function(quidd)
		    	{

		    		console.log("ask for create temporary enc for videotestsrc");
		    		//if it's video we create automaticlly compress vid shmdata
		    		if(quidd.class == "videotestsrc" || quidd.class == "gstvideosrc")
		    		{
		    			setTimeout(function(){
			    			console.log(quidd.name);
			    			var model = collections.quidds.get(quidd.name);
			    			var path = model.get("shmdatas")[0]["path"];
			    			console.log(path);
			    			collections.quidds.create("x264enc",quidd.name+"_enc", function(name)
			    			{
			    				views.methods.setMethod(name, "connect", [path]);
			    				console.log("SET !!!!");
			    			});

		    			},1000);

			    		// _.each(quidd.properties, function(property)
			    		// {
			    		// 	if(property.name == "shmdata-writers")
			    		// 	{
			    		// 		console.log(property);
				    	// 		var path = property.value.shmdata_writers[0].path;

				    	// 		collections.quidds.create("x264enc",quidd.name+"_enc", function(name)
				    	// 		{
				    	// 			views.methods.setMethod(name, "connect", [path]);
				    	// 			console.log("SET !!!!");
				    	// 		});
			    		// 	}
			    		// });
		    		}
		    		//return name for next step : set properties and methods
		    		callback(quidd.name);
		    	});
		    },
		    delete : function(quiddName){
		    	socket.emit("remove", quiddName);
		    },
		    getProperties : function(nameQuidd, callback)
		    {
		    	socket.emit("getPropertiesOfQuidd", nameQuidd, function(propertiesOfQuidd)
		    	{
		    		callback(propertiesOfQuidd);
		    	});
		    },
		    getPropertyValue : function(nameQuidd, property, callback){
		    	socket.emit("get_property_value", nameQuidd, property, function(propertyValue){
		    		callback(propertyValue);
		    	});
		    },
		    getPropertiesWithValues : function(nameQuidd, callback)
		    {
		    	socket.emit("getPropertiesOfQuiddWithValues", nameQuidd, function(propertiesOfQuidd)
		    	{
		    		callback(propertiesOfQuidd);
		    	});
		    },
		    setPropertyValue : function(nameQuidd, property, value)
		    {
		    	that = this;
		    	console.log("ask for set "+property+" of "+nameQuidd+" to "+value);

		    	socket.emit("setPropertyValue", nameQuidd, property, value, function(ok)
		    	{
		    		console.log(ok);
		    	});

		    }
		});

		return QuiddsCollection;
	})