define([
	'underscore',
	'backbone',
	'models/destination',
	'views/destination'
	],function(_, Backbone, ClassDocModel, ViewDestination){

		var DestinationsCollection = Backbone.Collection.extend({
			model : ClassDocModel,
			url : '/destinations/',
			parse : function(results, xhr){
		        return results.destinations;
		    },
		    initialize : function(){
		    	console.log("init collection Destinations");

		    	this.bind("add", function(model)
		    	{
		    		var view = new ViewDestination({model : model});
		    		views.destinations.displayTitle();
		    	});

		    	
		    	
		    },
		    render : function()
		    {
		    	collections.destinations.each(function(model)
				{
					var view = new ViewDestination({model : model});
				});
		    }
		});

		return DestinationsCollection;
	})