define([
	'underscore',
	'backbone',
	'text!/templates/createClient.html'
	],function(_, Backbone, templateCreateClient){

		var DestinationsView = Backbone.View.extend({
			el : 'body',
			events : { 
				"click #openPanelClient" : "openPanel",
				"click #createClient" : "create", 
			},
			initialize : function()
			{
				console.log("init ClientsView");
				this.displayTitle();
			},					
			openPanel : function()
			{
				var template = _.template(templateCreateClient);
				$("#panelRight .content").html(template);
				views.global.openPanel();
			},
			create : function()
			{
				var name = $("#clientName").val()
				,	host_name = $("#clientHost").val()
				,	port_soap = $("#clientSoap").val();

				collections.clients.create(name, host_name, port_soap);

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