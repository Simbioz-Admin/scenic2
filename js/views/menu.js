define([
	'underscore',
	'backbone',
	'text!/templates/menu.html'
	],function(_, Backbone, menuTemplate){

		var MenuView = Backbone.View.extend({
			el : '#menu',
			events : {
				"click .dropdown-toggle" : "openDropdown"
			},
			initialize : function(){
				console.log("init menu View");
				var template = _.template(menuTemplate, {menu : this.collection.toJSON()});
				$("#menu").html(template);
			},
			openDropdown : function(){
				menu = $(event.target);
				menu.next(".dropdown-menu").show();
				$(".dropdown-menu").mouseleave(function(){
					$(this).hide();
				})

			    
			}
		});

		return MenuView;
	})