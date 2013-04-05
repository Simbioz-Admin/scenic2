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
				"click .box" : "createConnection"
			},

			//generation of the main Menu 
			initialize : function(){
				console.log("init global View");
				var template = _.template(menuTemplate, {menu : this.collection.toJSON()});
				$("#menu").html(template);

				socket.on("messageLog", function(msg){
					$("#log .content").append(msg+"<br><br>");
					$("#log .content").scrollTop(100000000000000000);
				})

			},

			//action for open the sub-menu
			openDropdown : function(){
				var menu = $(event.target);
				menu.next(".dropdown-menu").show();
				$(".dropdown-menu").mouseleave(function(){
					$(this).hide();
				})
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
					//display connection is active between shmdata and destination
					//box.addClass("active");
				}else{
					console.log("DEBRANCHE!");
					views.methods.setMethod("defaultrtp", "remove_udp_stream_to_dest", [path, destName]);
					//box.removeClass("active");
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
				$("#lightBox, #bgLightbox").fadeIn(50);
			},
			closeLightBox : function(){
				$("#lightBox, #bgLightbox").fadeOut(50);
			}
		});

		return MenuView;
	})