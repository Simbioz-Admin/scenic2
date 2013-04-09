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
			},

			// render2 : function()
			// {
			// 	//remove all box
			// 	$(".box").remove();
			// 	var destinations = this.collection.toJSON();
				
			// 	if(destinations.length > 0 )
			// 	{
			// 		var templateHeader = _.template(templateDestination, {header : true, destinations : destinations});
			// 		var template = _.template(templateDestination, { header : false, destinations : destinations});

			// 		//add Header destinations
			// 		$("#headerDest").html(templateHeader);

			// 		//add the destination il all tr of table
			// 		$(".rows").each(function(index){
			// 			$(this).append(template);
			// 		});

			// 		//add active connection between shmdata and destination
			// 		_.each(destinations, function(destination)
			// 		{
			// 			_.each(destination.data_streams, function(shmdata)
			// 			{
			// 				$("[data-path='"+shmdata.path+"'] [data-destname='"+destination.name+"']").addClass("active");
			// 			})
			// 		});
			// 	}
			// },
					
			createPanel : function()
			{
				views.methods.getDescription("defaultrtp", "add_destination", function(methodDescription)
				{
					console.log(methodDescription);
					var template = _.template(templateMethod, { title : "set Method "+methodDescription.name, quiddName : "defaultrtp",  method : "add_destination", description : methodDescription});
					$("#lightBox").html(template);
					views.global.openLightBox();
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
					if(index != "method" && index != "quiddName"){
						parameters.push(value);
					}
				});

				views.methods.setMethod(dataForm.quiddName, dataForm.method, parameters, function(ok)
				{
					if(ok) views.global.closeLightBox();
				});

			return false;
			}
		});

		return DestinationsView;
	})