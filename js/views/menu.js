define([
	'underscore',
	'backbone',
	'text!/templates/menu.html',
	'text!/templates/quidd.html'
	],function(_, Backbone, menuTemplate, quiddTemplate){

		var MenuView = Backbone.View.extend({
			el : '#menu',

			//assocition between action on elements html and functions
			events : {
				"click .dropdown-toggle" : "openDropdown",
				"click .dropdown-menu li" : "createSource",
				"click #createDestination" : "createDestination"
			},

			//generation of the main Menu 
			initialize : function(){
				console.log("init menu View");
				var template = _.template(menuTemplate, {menu : this.collection.toJSON()});
				$("#menu").html(template);
			},

			//action for open the sub-menu
			openDropdown : function(){
				var menu = $(event.target);
				menu.next(".dropdown-menu").show();
				$(".dropdown-menu").mouseleave(function(){
					$(this).hide();
				})
			},

			//open the lightbox and show the properties to define for create the quidd Source
			createSource : function(){

				var className = $(event.target).data("name")
				,	classDoc = this.collection.get(className)
				,	template = _.template(quiddTemplate, {title : "Create "+className, classDoc : classDoc, action : "create"});
				console.log(classDoc);
				$("#lightBox").html(template);
				this.openLightBox();
			},
			createDestination : function(){
				views.methods.getMethod("defaultrtp", "add_destination");
			},

			//alert for different message
			alertMsg : function(type, msg){
				$("#msgHighLight").remove();
				$("body").append("<div id='msgHighLight' class='"+type+"'>"+msg+"</div>");
				$("#msgHighLight").fadeIn(200).delay(5000).fadeOut(200, function(){$(this).remove();});
				$("#msgHighLight").click(function(){
					$(this).remove();
				})
			},
			openLightBox : function(){
				$("#lightBox, #bgLightbox").fadeIn(200);
			},
			closeLightBox : function(){
				$("#lightBox, #bgLightbox").fadeOut(200);
			}
		});

		return MenuView;
	})