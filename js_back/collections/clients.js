define([
	'underscore',
	'backbone',
	'models/client',
	'views/destination'
	],function(_, Backbone, ClientModel, ViewDestination){

		var ClientsCollection = Backbone.Collection.extend({
			model : ClientModel,
			url : '/destinations/',
			parse : function(results, xhr){
		        return results.destinations;
		    },
		    initialize : function(){
		    	console.log("init collection Clients");

		    	this.bind("add", function(model)
		    	{
		    		var view = new ViewDestination({model : model});
		    		views.destinations.displayTitle();
		    	});

		    	
		    	
		    },
		    render : function()
		    {
		    	
		    	collections.clients.each(function(model)
				{
					var view = new ViewDestination({model : model});
				});
		    }
		});

		return ClientsCollection;
	})