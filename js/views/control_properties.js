define([
	'underscore',
	'backbone'
	],function(_, Backbone){

		var ViewsControlProperties = Backbone.View.extend({
			el : 'body',
			events : {
				"click .create-ControlProperty" : "createControlProperty"
			},
			initialize : function()
			{
				console.log("init Views ViewsControlProperties");
			},
			listQuiddsAndProperties : function()
			{
				var quidds = collections.quidds.toJSON();
				console.log(quidds);
			},
			createControlProperty : function(element)
			{
				var property = $(element.target).data("property")
				,	quiddName = $(element.target).closest("ul").data("quiddname");
				
				this.collection.setDico(quiddName, property);
				$(element.target).remove();
			}
		});

		return ViewsControlProperties;
	})