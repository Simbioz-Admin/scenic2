define([
	'underscore',
	'backbone',
	'views/quidd',
	],function(_, Backbone, ViewQuidd){

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
				that.getProperties(function(){
					that.getMethodsDescription(function(){
						//console.log("properties and methods are recovered");
					});
				});
				if(this.collection)
				{
					this.setShmdatas(function(ok){
						var view = new ViewQuidd({ model : that, table : "transfert"});
						var view2 = new ViewQuidd({model : that, table : "control"});
					});
				}
			},
			setShmdatas : function(callback){
				var that = this;
				//ask for value of shmdatas and stock in model
				this.collection.getPropertyValue(this.get("name"), "shmdata-writers", function(shmdatas)
				{
					that.set({ shmdatas  : shmdatas.shmdata_writers});
					callback(shmdatas.shmdata_writers);
				});
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
			getMethodsDescription : function(callback)
			{
				var that = this;
				socket.emit("getMethodsDescription", this.get("name"), function(methodsDescription)
				{
					that.set("methods", methodsDescription);
					callback(methodsDescription);
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