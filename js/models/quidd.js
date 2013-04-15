define([
	'underscore',
	'backbone',
	'views/quidd',
	],function(_, Backbone, ViewQuidd){

		var QuiddModel = Backbone.Model.extend({
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
				this.getShmdatas(function(ok){
					var view = new ViewQuidd({ model : that });
				});
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
				
			}
		});

		return QuiddModel;
	})