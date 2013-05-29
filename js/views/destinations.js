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
					var template = _.template(templateMethod, { title : "set Method "+methodDescription.name, quiddName : "defaultrtp",  method : "add_destination", description : methodDescription});
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
					if(index != "method" && index != "quiddName"){
						parameters.push(value);
					}
				});

				views.methods.setMethod(dataForm.quiddName, dataForm.method, parameters, function(ok)
				{
					if(ok) views.global.closePanel();
				});

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