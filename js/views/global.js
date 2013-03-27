define([
	'underscore',
	'backbone',
	'text!/templates/menu.html',
	'text!/templates/quidd.html',
	'text!/templates/setMethod2.html'
	],function(_, Backbone, menuTemplate, quiddTemplate, setMethodTemplate){

		var MenuView = Backbone.View.extend({
			el : 'body',

			//assocition between action on elements html and functions
			events : {
				"click .dropdown-toggle" : "openDropdown",
				"click .dropdown-menu li" : "createSource",
				"click #createDestination" : "createDestination",
				"click .box" : "createConnection"
			},

			//generation of the main Menu 
			initialize : function(){
				console.log("init global View");
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
				,	that = this;


				this.collection.getPropertiesWithout(className, ["shmdata-readers", "shmdata-writers"], function(properties){
					var template = _.template(quiddTemplate, {title : "Create "+className, className : className,  properties : properties, action : "create"});
					$("#lightBox").html(template);
					that.openLightBox();
				});
				
				views.methods.getMethodsByClassWithFilter(className, ["add_shmdata_path"], function(methods){
					var template = _.template(setMethodTemplate, {methods : methods});
					$("#lightBox ul").after(template);
				});

			},
			createDestination : function(){
				views.methods.getMethod("defaultrtp", "add_destination");
			},
			createConnection : function(){
				var box = $(event.target)
				,	destName = box.data("destname")
				,	path = box.parent().data("path")
				,	port = "8050";

				if(!box.hasClass("active")){
					//add to the session the shmdata 
					views.methods.setMethod("defaultrtp", "add_data_stream", [path]);
					//connect shmdata to destination
					views.methods.setMethod("defaultrtp", "add_udp_stream_to_dest", [path, destName, port]);

					console.log(destName, path);
				}else{
					console.log("DEBRANCHE!");
					views.methods.setMethod("defaultrtp", "remove_udp_dest", [path, destName, port]);
				}
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