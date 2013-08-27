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

		    	socket.on("remove_destination", function(invoke, quiddName, parameters)
		    	{
		    		var model = that.get(parameters[0]);
		    		model.trigger('destroy', model, that);
	    			views.global.notification("info","client "+ parameters[0]+" has deleted");
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
		    }
		});

		return ClientsCollection;
	})