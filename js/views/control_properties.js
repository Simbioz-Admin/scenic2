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
				,	that = this
				,	quiddName = $(element.target).closest("ul").data("quiddname");
				
				this.collection.setDico(quiddName, property, function(quiddName) {
					
					$("#control .property").each(function(index, source){
						$(this).append("<td class='box' data-hostname='"+quiddName+"'></td>");
					});
					$(element.target).remove();
				});
			}
		});

		return ViewsControlProperties;
	})