define([
	'underscore',
	'backbone'
	],function(_, Backbone){

		var Destination = Backbone.Model.extend({
			idAttribute: "name",
			defaults : {
				"name" : null,
				"host_name" : null,
				"data_streams" : []
			},
			initialize : function(){
				//ask for create node osc-receive\
			}
		});

		return Destination;
	})