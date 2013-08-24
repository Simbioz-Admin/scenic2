define([
	'underscore',
	'backbone',
	'models/quidd',
	'views/quidd',
	],function(_, Backbone, QuiddModel, QuiddsView){

		var QuiddsCollection = Backbone.Collection.extend({
			model : QuiddModel,
			url : '/quidds/',
			listEncoder : [],
			parse : function(results, xhr)
			{
		        return results;
		    },
		    initialize : function()
		    {
		    	console.log("init collection quidds");
		    	var that = this;

		    	//receive notification for add quidd to the collection Quidds
		    	socket.on("create", function(quidd)
		    	{
		    		var model = new QuiddModel(quidd);
		    		console.log(quidd);
		    		that.add(model);
		    	});

		    	socket.on("signals_properties", function(quiddName, prop, value)
		    	{
		    		if(prop == "byte-rate") views.quidds.stateShmdata(quiddName, value);
		    		else
		    		{
		    			var model = collections.quidds.get(quiddName);
		    			model.setLocalpropertyValue(prop, value);
		    		}
		    	});

		    	socket.on("updateShmdatas", function(qname, shmdatas)
		    	{
		    		var quidds = that.get(qname);
		    		//sometimes the server ask to update shmdatas but is not yet insert in frontend, also we check that!
		    		if(quidds)
		    		{
			    		quidds.set("shmdatas", shmdatas);
			    		//control if encoder is ask for this quidd
			    		_.each(that.listEncoder, function(encoder, index)
			    		{
			    			if(encoder.quiddName == qname)
			    			{
			    				that.create(encoder.encoder,qname+"_enc", function(quidd)
				    			{
				    				views.methods.setMethod( quidd.name, "connect", [shmdatas[0].path]);
				    				that.listEncoder.splice(index, 1);
				    			});
			    			}
			    		});
		    		}

		    	});

		    	socket.on("remove", function(quiddName)
		    	{
		    		that.remove(quiddName);
		    	});


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
		    create : function(className, quiddName, callback)
		    {
		    	//ask for create a Quidd
		    	socket.emit("create", className, quiddName, function(quidd)
		    	{
		    		callback(quidd);
		    	});
		    },
		    createAndGetProperties : function(className, name, callback)
		    {
		    	//ask for create a Quidd
		    	socket.emit("create", className, name, function(quidd)
		    	{
		    		callback(quidd);
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
		    getMethodsDescription : function(nameQuidd, callback)
		    {	
		    	socket.emit("getMethodsDescription", nameQuidd, function(methodsDescription)
		    	{
		    		callback(methodsDescription);
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
		    	console.log("ask for get properties and value :", nameQuidd);
		    	socket.emit("getPropertiesOfQuiddWithValues", nameQuidd, function(propertiesOfQuidd)
		    	{
		    		callback(propertiesOfQuidd);
		    	});
		    },
		    setPropertyValue : function(nameQuidd, property, value, callback)
		    {
		    	socket.emit("setPropertyValue", nameQuidd, property, value, function(ok)
	    		{
	    			if(callback) callback(ok);
	    		});
		    }
		});

		return QuiddsCollection;
	})