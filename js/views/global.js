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
				"click .box" : "createConnection",
				"click #close" : "closePanel",
				"change .checkbox" : 'stateCheckbox'
			},

			//generation of the main Menu 
			initialize : function(){
				console.log("init global View");
				var template = _.template(menuTemplate, {menu : this.collection.toJSON()});
				$("#menuTable").html(template);

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
				,	destName = box.data("hostname")
				,	path = box.parent().data("path")
				,	port = "8050";

				console.log(destName, path, port);

				if(!box.hasClass("active")){
					//add to the session the shmdata 
					views.methods.setMethod("defaultrtp", "add_data_stream", [path], function(ok){

					});
					//connect shmdata to destination
					views.methods.setMethod("defaultrtp", "add_udp_stream_to_dest", [path, destName, port], function(ok){

					});
					//display connection is active between shmdata and destination
					//box.addClass("active");
				}else{
					views.methods.setMethod("defaultrtp", "remove_udp_stream_to_dest", [path, destName], function(ok){});
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
			openPanel : function(){
				$("#panelLeft").animate({width : "70%"});
				$("#panelRight").delay(100).animate({width : "30%"});

			},
			closePanel : function(){
				$("#panelLeft").delay(100).animate({width : "100%"});
				$("#panelRight").animate({width : "0px"});
			},
			stateCheckbox : function(){
					
					var check = $(event.target);

					if (check.is(':checked')) {
						console.log("check");
						check.val('true').attr('checked', true);
					}else{
						console.log("uncheck");
						check.val('false').attr('checked', false);
					}
				     // if($(this).attr('checked')){
				     //      $(this).val('TRUE');
				     // }else{

				     //      $(this).val('FALSE');
				     // }
	
			}
		});

		return MenuView;
	})