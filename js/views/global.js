define([
	'underscore',
	'backbone',
	'text!/templates/menu.html',
	'text!/templates/quidd.html',
	'text!/templates/setMethod2.html'
	],function(_, Backbone, menuTemplate, quiddTemplate, setMethodTemplate){

		var MenuView = Backbone.View.extend({
			el : 'body',
			statePanelIrc : false,
			//assocition between action on elements html and functions
			events : {
				"click .dropdown-toggle" : "openDropdown",
				"click .box" : "connection",
				"keypress #port_destination" : "setConnection",
				"blur #port_destination" : "removeInputDestination",
				"click #close" : "closePanel",
				"change .checkbox" : 'stateCheckbox',
				"click #btn-irc" : 'panelIrc'
			},

			//generation of the main Menu 
			initialize : function()
			{
				console.log("init global View");
				var that = this;
				var template = _.template(menuTemplate, {menu : this.collection.toJSON()});
				$("#menuTable").html(template);

				socket.on("messageLog", function(msg)
				{
					$("#log .content").append(msg+"<br><br>");
					$("#log .content").scrollTop(100000000000000000);
				});

				$("#globalTable").draggable({ cursor: "move", handle:"#headerTable"});

				$(document).keyup(function(e){
					that.keyboardAction(e);
				});

			},
			//action for open the sub-menu
			openDropdown : function()
			{
				var menu = $(event.target);
				menu.next(".dropdown-menu").show();
				$(".dropdown-menu").mouseleave(function(){
					$(this).hide();
				})
			},
			connection : function()
			{
				console.log("AAA");
				
				var box = $(event.target)
				,	destName = box.data("hostname")
				,	path = box.parent().data("path");

				if(box.hasClass("active"))
				{
					views.methods.setMethod("defaultrtp", "remove_udp_stream_to_dest", [path, destName], function(ok){});
				}
				else
				{
					box.html("<input id='port_destination' autofocus='autofocus' type='text' placeholder='define port'>");
				}
			},
			setConnection : function(event)
			{
				if(event.which == 13) //touch enter
				{
					var box = $(event.target).parent()
					,	destName = box.data("hostname")
					,	path = box.parent().data("path")
					,	port = $(event.target).val();

					//add to the session the shmdata 
					views.methods.setMethod("defaultrtp", "add_data_stream", [path], function(ok){});
					//connect shmdata to destination
					views.methods.setMethod("defaultrtp", "add_udp_stream_to_dest", [path, destName, port], function(ok){});

					this.removeInputDestination(event);
				}
			},
			removeInputDestination : function(event)
			{
				$(event.target).parent().html("");
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
			openPanel : function()
			{
				$("#panelLeft").animate({width : "70%"});
				$("#panelRight").delay(100).animate({width : "30%"});
			},
			closePanel : function()
			{
				$("#panelLeft").delay(100).animate({width : "100%"});
				$("#panelRight").animate({width : "0px"});
			},
			keyboardAction : function(event)
			{
				var that = this;
			    if(event.which == 27) that.closePanel();
			},
			stateCheckbox : function(){
					
					var check = $(event.target);

					if (check.is(':checked')) check.val('true').attr('checked', true);
					else check.val('false').attr('checked', false);
			},
			panelIrc : function(){
				if(!this.statePanelIrc)
				{
					$("#chat").show();
					this.statePanelIrc = true;		
				}
				else
				{
					$("#chat").hide();	
					this.statePanelIrc = false;
				}
			}
		});

		return MenuView;
	})