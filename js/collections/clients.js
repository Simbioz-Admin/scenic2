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

		    	socket.on("add_connection", function(invoke, quiddName, parameters){
					$("[data-path='"+parameters[0]+"'] [data-hostname='"+parameters[1]+"']").addClass("active");
		    	})

		    	socket.on("remove_connection", function(invoke, quiddName, parameters){
		    		$("[data-path='"+parameters[0]+"'] [data-hostname='"+parameters[1]+"']").removeClass("active");
		    	})

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
						if(clientHost.indexOf("http://") < 0) clientHost = "http://"+clientHost;
						var soapClient = "soapClient-"+clientName
						,	addressClient = clientHost+":"+portSoap;
						
						collections.quidds.create("SOAPcontrolClient", soapClient, function(ok)
						{
							if(ok)
							{
								console.log("set_remote_url", addressClient)
								socket.emit("invoke", soapClient, "set_remote_url", [addressClient], function(ok){ console.log("set_remote_url", ok); });
								console.log("create",  ["httpsdpdec", config.nameComputer])
								socket.emit("invoke", soapClient, "create", ["httpsdpdec", config.nameComputer], function(ok){ console.log("httpsdpdec", ok); });
								socket.emit("invoke", soapClient, "create", ["videotestsrc", "newVideo"], function(ok){ console.log("httpsdpdec", ok); });

							}
						});
					}

		    	});
		    }
		});

		return ClientsCollection;
	})