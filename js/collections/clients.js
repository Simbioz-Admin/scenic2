define([
	'underscore',
	'backbone',
	'models/client',
	],function(_, Backbone, ClientModel){

		var ClientsCollection = Backbone.Collection.extend({
			model : ClientModel,
			url : '/destinations/',
			parse : function(results, xhr){
		        return results.destinations;
		    },
		    initialize : function()
		    {
		    	console.log("init collection Clients");

		    	// this.bind("add", function(model)
		    	// {
		    	// 	var view = new ViewDestination({model : model});
		    	// 	views.destinations.displayTitle();
		    	// });
		    },
		    render : function()
		    {
		    	collections.clients.each(function(model)
				{
					var view = new ViewDestination({model : model});
				});
		    },
		    create : function(clientName, clientHost, portSoap)
		    {
		    	socket.emit("invoke", "defaultrtp", "add_destination", [clientName, clientHost], function(ok)
		    	{
		    		console.log("the client "+clientName+" is added");

		    		///*** set connection with another scenic computer ***//
					if(portSoap)
					{
						if(portSoap.indexOf("http://") < 0) portSoap = "http://"+portSoap;
						var soapClient = "soapClient-"+clientName
						,	addressClient = clientHost+":"+portSoap;
						
						collections.quidds.create("SOAPcontrolClient", soapClient, function(ok)
						{
							socket.emit("invoke", soapClient, "set_remote_url", [addressClient]);
							socket.emit("invoke", soapClient, "create", ["httpsdpdec", config.nameComputer]);
							if(!ok)console.log("not existing");
						});
					}

		    	});
		    },
		    update : function()
		    {
		    	
		    },
		    remove : function(name)
		    {
				var result = confirm("Are you sure?");
				if (result==true)
				{
					socket.emit("invoke", "defaultrtp", "remove_destination", [name], function(ok)
					{
						console.log("the client "+name+" has been removed")
					});
				}
		    }
		});

		return ClientsCollection;
	})