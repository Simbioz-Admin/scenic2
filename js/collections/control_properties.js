define([
	'underscore',
	'backbone',
	'models/control_property'
	],function(_, Backbone, ModelControlProperty){

		var CollectionControlProperties = Backbone.Collection.extend({
			model : ModelControlProperty,
			parse : function(results, xhr){
		        return results;
		    },
		    initialize : function()
		    {
		    	console.log("init CollectionControlProperties");
		    }
		});

		return CollectionControlProperties;
	})