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
					this.setShmdatas(function(ok){
						var view = new ViewQuidd({ model : that });
					});
				}
			},
			setShmdatas : function(callback){
				var that = this;
				//ask for value of shmdatas and stock in model
				this.collection.getPropertyValue(this.get("name"), "shmdata-writers", function(propertyValue)
				{
					that.set({ shmdatas  : propertyValue.shmdata_writers});
					callback(propertyValue.shmdata_writers);
				});
			},
			remove : function()
			{
				this.destroy();
			}
		});

		return QuiddModel;
	})