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
		    	var that = this;

		    	socket.on("add_destination", function(invoke, quiddName, parameters)
		    	{
					that.add({name : parameters[0], host_name : parameters[1]});
		    		views.global.notification("info", "the client "+ parameters[0]+" is added");
		    	});

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
		    		///*** set connection with another scenic computer ***//
		    		console.log(portSoap);
					if(portSoap)
					{
						if(portSoap.indexOf("http://") < 0) portSoap = "http://"+portSoap;
						var soapClient = "soapClient-"+clientName
						,	addressClient = clientHost+":"+portSoap;
						
						collections.quidds.create("SOAPcontrolClient", soapClient, function(ok)
						{
							if(ok)
							{
								socket.emit("invoke", soapClient, "set_remote_url", [addressClient], function(ok){ console.log("set_remote_url", ok); });
								socket.emit("invoke", soapClient, "create", ["httpsdpdec", config.nameComputer], function(ok){ console.log("httpsdpdec", ok); });
							}
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