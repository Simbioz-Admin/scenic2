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
		    	var that = this;

		    	//receive notification for add quidd to the collection Quidds
		    	socket.on("create", function(quidd)
		    	{
		    		var model = new QuiddModel(quidd);
		    		that.add(model);
		    	});

		    	socket.on("remove", function(quiddName)
		    	{
		    		that.remove(quiddName);
		    	});

		    	socket.on("signals_properties", function(name, prop, value)
		    	{
		    		//console.log("prop : ", name, prop, value);
		    	})

		    	//receive notification for set property of quidd
		    	socket.on("setPropertyValue", function(nameQuidd, property, value)
		    	{
		    		var quidd = that.get(nameQuidd);

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
		    		// if(quidd.class == "videotestsrc" || quidd.class == "gstvideosrc")
		    		// {
		    		// 	setTimeout(function(){
			    	// 		console.log(quidd.name);
			    	// 		var model = collections.quidds.get(quidd.name);
			    	// 		var path = model.get("shmdatas")[0]["path"];
			    	// 		console.log(path);
			    	// 		collections.quidds.create("x264enc",quidd.name+"_enc", function(name)
			    	// 		{
			    	// 			views.methods.setMethod(name, "connect", [path]);
			    	// 			console.log("SET !!!!");
			    	// 		});

		    		// 	},1000);

		    		// }
		    		//return name for next step : set properties and methods
		    		callback(quidd.name);
		    	});
		    },
		    delete : function(quiddName)
		    {
		    	socket.emit("remove", quiddName);
		    },
		    getProperties : function(nameQuidd, callback)
		    {
		    	socket.emit("getPropertiesOfQuidd", nameQuidd, function(propertiesOfQuidd)
		    	{
		    		callback(propertiesOfQuidd);
		    	});
		    },
		    getPropertyValue : function(nameQuidd, property, callback)
		    {
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
		    	socket.emit("setPropertyValue", nameQuidd, property, value, function(ok){});
		    }
		});

		return QuiddsCollection;
	})