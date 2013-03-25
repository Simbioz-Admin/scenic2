define([
	'underscore',
	'backbone',
	'models/destination'
	],function(_, Backbone, ClassDocModel){

		var DestinationsCollection = Backbone.Collection.extend({
			model : ClassDocModel,
			url : '/destinations/',
			parse : function(results, xhr){
		        return results.destinations;
		    },
		    initialize : function(){
		    	console.log("init collection Destinations");
		    	
		    }
		});

		return DestinationsCollection;
	})