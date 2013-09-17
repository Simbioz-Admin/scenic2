define([
	'underscore',
	'backbone',
	'text!/templates/destination.html'
	],function(_, Backbone, templateDestination){

		var DestinationsView = Backbone.View.extend({
			tagName : 'td',
			className : 'nameInOut',
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
				var template = _.template(templateDestination, {name : this.model.get("name")});
				$(this.el).append(template);
				$("#transfert .destinations").append($(this.el));
				console.log(this.el);
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