define([
	'underscore',
	'backbone'
	],function(_, Backbone){

		var Shmdata = Backbone.Model.extend({
			idAttribute: "name",
			defaults : {
				"quiddName" : null,
				"paths" : {}
			},
			initialize : function(){
				//ask for create node osc-receive\
			}
		});

		return Shmdata;
	})