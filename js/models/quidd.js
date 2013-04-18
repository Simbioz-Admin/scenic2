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
				"shmdatas" : {}
			},
			initialize : function()
			{
				var that = this;
				if(this.collection)
				{
					this.getShmdatas(function(ok){
						var view = new ViewQuidd({ model : that });
					});
				}
			},
			getShmdatas : function(callback){
				var that = this;
				//ask for value of shmdatas and stock in model
				this.collection.getPropertyValue(this.get("name"), "shmdata-writers", function(propertyValue){
					that.set({ shmdatas  : propertyValue.shmdata_writers});
					console.log("add shmdatas");
					callback("ok");
				});
			},
			getProperties : function(){
				
			},
			remove : function(){
				console.log("DESTROY !!!");
				this.destroy();
			}
		});

		return QuiddModel;
	})