define([
	'underscore',
	'backbone',
	'models/shmdata'
	],function(_, Backbone, ShmdataModel){

		var ShmdatasCollection = Backbone.Collection.extend({
			model : ShmdataModel,
			url : '/shmdatas/',
			parse : function(results, xhr){
		        return results;
		    }
		});

		return ShmdatasCollection;
	})