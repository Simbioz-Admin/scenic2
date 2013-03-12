define([
	'underscore',
	'backbone'
	],function(_, Backbone){

		var QuiddModel = Backbone.Model.extend({
			defaults : {
				"name" : null,
				"class" : null
			},
			initialize : function(){
				//ask for create node osc-receive\
			}
		});

		return QuiddModel;
	})