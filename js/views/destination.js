define([
	'underscore',
	'backbone',
	'text!/templates/destination.html',
	'text!/templates/setMethod.html'
	],function(_, Backbone, templateDestination, templateMethod){

		var DestinationsView = Backbone.View.extend({
			tagName : 'td',
			className : 'nameInOut',
			template : templateDestination,
			events : {
				"click .remove" : "askForRemove",

			},
			initialize : function()
			{
				this.render();
				this.model.on('remove', this.remove, this);
			},
			render : function()
			{
				that = this;
				$(this.el).append("<div class='short'>"+this.model.get("name")+"<div class='remove'>x</div></div>");
				$("#destinations").append($(this.el));
				$(".shmdata").each(function(index, source){
					$(this).append("<td class='box' data-hostname='"+that.model.get('name')+"'></td>");
				});
				//views.destinations.displayTitle();
			},
			askForRemove : function()
			{
				var name = this.model.get("name");
				var result = confirm("Are you sure?");
				if (result==true)
				{
					views.methods.setMethod("defaultrtp", "remove_destination", [name], function(ok){});
				}
			},
			remove : function()
			{
				var name = this.model.get("name");
				$(this.el).remove();
				$("[data-hostname='"+name+"']").remove();
				views.destinations.displayTitle();

			}
			
		});

		return DestinationsView;
	})