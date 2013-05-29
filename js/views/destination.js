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
				//"click" : "test",

			},
			initialize : function()
			{
				this.render();
			},
			render : function()
			{
				that = this;
				$(this.el).append("<div class='short'>"+this.model.get("name")+"</div>");
				$("#destinations").append($(this.el));
				$(".shmdata").each(function(index, source){
					$(this).append("<td class='box' data-hostname='"+that.model.get('name')+"'></td>");
				});
				//views.destinations.displayTitle();
			}
			
		});

		return DestinationsView;
	})