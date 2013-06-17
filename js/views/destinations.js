define([
	'underscore',
	'backbone',
	'text!/templates/destination.html',
	'text!/templates/setMethod.html'
	],function(_, Backbone, templateDestination, templateMethod){

		var DestinationsView = Backbone.View.extend({
			el : 'body',
			events : {
				"click #createDestination" : "createPanel", 
				"click #setMethod_add_destination" : "create"

			},
			initialize : function()
			{
				console.log("init DestinationsView");
				this.displayTitle();
			},					
			createPanel : function()
			{
				views.methods.getDescription("defaultrtp", "add_destination", function(methodDescription)
				{
					console.log(methodDescription);
					var template = _.template(templateMethod, { title : "set Method "+methodDescription.name, className : "defaultrtp",  method : "add_destination", description : methodDescription});
					$("#panelRight .content").html(template);
					views.global.openPanel();
				});
			},
			create : function()
			{
				var dataForm = $("#form-lightbox").serializeObject()
				,	parameters = [];

				
				//recover the values of fields
				_.each(dataForm, function(value, index)
				{
					//exclude method and name for generate parameters array
					if(index != "method" && index != "className" && index != "port_soap"){
						parameters.push(value);
					}
				});

				views.methods.setMethod(dataForm.className, dataForm.method, parameters, function(ok)
				{
					if(ok) views.global.closePanel();
				});


				///*** set connection with another scenic computer ***//
				if(dataForm.host_name.indexOf("http://") < 0) dataForm.host_name = "http://"+dataForm.host_name;
				if(dataForm.port_soap)
				{

					var soapClient = "soapClient-"+dataForm.name
					,	addressClient = dataForm.host_name+":"+dataForm.port_soap;


					console.log("soapClient", soapClient);
					
					collections.quidds.create("SOAPcontrolClient", soapClient, function(ok)
					{

						var ok = views.methods.setMethod(soapClient, "set_remote_url", [addressClient]);
						views.methods.setMethod(soapClient, "create", ["httpsdpdec", config.nameComputer], function(ok){});

						if(!ok)
						{
							console.log("not existing");
							//collections.quidds.remove(soapClient);
						}
					});
				}


			return false;
			},
			displayTitle : function()
			{
				//check number of quidd for titleIn

				if(this.collection.size() != 0) $("#titleOut").show();
				else $("#titleOut").hide();
			}
		});

		return DestinationsView;
	})