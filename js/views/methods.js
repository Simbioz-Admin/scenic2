define([
	'underscore',
	'backbone',
	],function(_, Backbone){

		var MethodsView = Backbone.View.extend({
			el : '#lightBox',
			events : {
				'click #setMethod' : 'setMethod'
			},
			initialize : function()
			{
				console.log("init MethodsView");
				socket.on("invoke", function(ok, quiddName, method, parameters)
				{

					if(ok)
					{
						if(method == "add_destination")
						{
							collections.destinations.add({name : parameters[0], host_name : parameters[1]});
						}
						if(method == "add_udp_stream_to_dest")
						{
							$("[data-path='"+parameters[0]+"'] [data-hostname='"+parameters[1]+"']").addClass("active");
						}
						if(method == "remove_udp_stream_to_dest")
						{
							$("[data-path='"+parameters[0]+"'] [data-hostname='"+parameters[1]+"']").removeClass("active");
						}
					}
				});

				_.bindAll(this, "render");
				//this.collection.bind("add", this.addDestination);
				this.render();
			},
			getDescription : function(quiddName, method, callback)
			{
				//ask description of method for generate form insertion
				socket.emit("getMethodDescription", quiddName, method, function(methodDescription)
				{
					callback(methodDescription);
				});
			},
			getMethodsByClassWithFilter : function(className, filter, callback)
			{

				methods = {};
				socket.emit("getMethodsDescriptionByClass", className, function(methodByClass)
				{
					_.filter(methodByClass, function(method, index)
					{
		    			var existing = $.inArray(method.name, filter);
		    			if(existing >= 0 ) methods[index] = method;
		    		});
		    		callback(methods);
				});
			},
			setMethod : function(quiddName, method, parameters, callback)
			{
				socket.emit("invoke", quiddName, method, parameters, function(ok)
				{
					if(ok)
					{
						//update the properties of quidd because setMethod can change properties or create
						var quidd = collections.quidds.get(quiddName);
						if(quidd)
						{
							collections.quidds.getProperties(quiddName, function(propertiesOfQuidd)
							{
								quidd.set({"properties" : propertiesOfQuidd});
							});
						}
						if(callback) callback(ok);
					}
				});
			}
		});	

		return MethodsView;
	});