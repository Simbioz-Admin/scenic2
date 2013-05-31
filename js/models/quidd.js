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
					//var view = new ViewQuidd({ model : that });
					this.setShmdatas(function(ok){
						var view = new ViewQuidd({ model : that });
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
			}
		});

		return QuiddModel;
	})