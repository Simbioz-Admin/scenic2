define([
	'underscore',
	'backbone',
	'views/source'
	],function(_, Backbone, ViewSource){

		var QuiddModel = Backbone.Model.extend({
			url : "/quidd/",
			idAttribute: "name",
			defaults : {
				"name" : null,
				"class" : null,
				"properties" : [],
				"methods" : [],
				"encoder_category" : null,
				"shmdatas" : null
			},
			initialize : function()
			{
				var that = this;
				
				//get properties and methods when quidd is created
				that.getShmdatas(function(shmdatas){
					that.getProperties(function(){
						that.getMethodsDescription(function(){
							
							//when the model quidd is created and we are recovered all value necessary, we created automaticlly one or multiple views 
				    		_.each(collections.tables.toJSON(), function(table)
				    		{
				    			if(table.type == "transfer")
				    			{
				    				var view = new ViewSource({model : that, table : "transfer"});
				    			}
				    			if(table.type == "control")
				    			{
				    				//var view = new ViewDestination({model : model});
				    			}
				    		});
						});
					});
				});
				

				
				// if(this.collection)
				// {
				// 	this.setShmdatas(function(ok){
				// 		var view = new ViewQuidd({ model : that, table : "transfert"});
				// 		var view2 = new ViewQuidd({model : that, table : "control"});
				// 	});
				// }
			},

			remove : function()
			{
				this.destroy();
			},
			setPropertyValue : function(property, value, callback)
			{
				var that = this;
				socket.emit("setPropertyValue", this.get("name"), property, value, function(property, value)
	    		{	
	    			//that.get("properties")[property] = value;
	    			callback("ok");
	    		});
			},
			setLocalpropertyValue : function(prop, value)
			{
				_.each(this.get("properties"), function(property){
					if(property.name == prop) property.value = value;
				});
			},
			getProperties : function(callback)
			{
				var that = this;
				socket.emit("getPropertiesOfQuidd", this.get("name"), function(propertiesOfQuidd)
		    	{
		    		that.set("properties", propertiesOfQuidd);
		    		callback(propertiesOfQuidd);
		    	});
			},
			getPropertyValue : function(property, callback)
			{
				var that = this;
				socket.emit("get_property_value", this.get("name"), property, function(propertyValue){
		    		callback(propertyValue);
		    	});
			},
			getMethodsDescription : function(callback)
			{
				var that = this;
				socket.emit("getMethodsDescription", this.get("name"), function(methodsDescription)
				{
					that.set("methods", methodsDescription);
					callback(methodsDescription);
				});
			},
			getShmdatas : function(callback){
				var that = this;
				//ask for value of shmdatas and stock in model
				this.getPropertyValue("shmdata-writers", function(shmdatas)
				{
					that.set({ shmdatas : shmdatas.shmdata_writers});
					if(callback) callback(shmdatas.shmdata_writers);
				});
			},
			setMethod : function(method, parameters, callback)
			{
				socket.emit("invoke", this.get("name"), method, parameters, function(ok)
				{
					callback(ok);
				});
			}
		});

		return QuiddModel;
	})