define([
	'underscore',
	'backbone'
	],function(_, Backbone){

		var QuiddModel = Backbone.Model.extend({
			idAttribute: "name",
			defaults : {
				"name" : null,
				"class" : null,
				"properties" : []
			},
			initialize : function(){
				//ask for create node osc-receive\
			}
		});

		return QuiddModel;
	})