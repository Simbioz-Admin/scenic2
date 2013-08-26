define([
	'underscore',
	'backbone',
	'text!/templates/menu.html',
	'text!/templates/quidd.html',
	'text!/templates/setMethod2.html',
	'text!/templates/panelInfo.html'
	],function( _, Backbone, menuTemplate, quiddTemplate, setMethodTemplate, panelInfoTemplate){

		var MenuView = Backbone.View.extend({
			el : 'body',
			statePanelIrc : false,
			statePanelLog : false,
			statePanelInfo : false,
			//assocition between action on elements html and functions
			events : {
				"click .dropdown-toggle" : "openDropdown",
				"click .box" : "connection",
				"keypress #port_destination" : "setConnection",
				"blur #port_destination" : "removeInputDestination",
				"click #close-panelRight" : "closePanel",
				"click #close-panelInfoSource" : "closePanelInfoSource",
				"change .checkbox" : 'stateCheckbox',
				"click #btn-irc, .close-irc" : 'panelIrc',
				"click #btn-log" : 'panelLog',
				"click #btn-info" : 'panelInfo',
				"click #btnSave" : 'save',
				"click #btnLoadScratch" : 'load_from_scratch',
				"mouseenter td.nameInOut, .groupSource" : "showActions",
				"mouseleave td.nameInOut, .groupSource" : "hideActions",
				"click .tabTable" : 'showTable'

			},

			//generation of the main Menu 
			initialize : function()
			{

				console.log("init global View");
				var that = this;
				// var sources = _.groupBy(this.collection.toJSON(), function(source)
				// {
				// 	return source.category;
				// })

				// var template = _.template(menuTemplate, {menu : sources});
				//$("#menuTable").html(template);

				socket.on("messageLog", function(msg)
				{
					$("#log .content").append(msg+"<br><br>");
					$("#log .content").scrollTop(100000000000000000);
				});


				//$("#globalTable").draggable({ cursor: "move", handle:"#headerTable"});
				$("#panelRight .content, .panelInfoSource").draggable({ cursor: "move", handle: "#title"});

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
					views.methods.setMethod("defaultrtp", "add_data_stream", [path], function(ok){ console.log("data added to stream");});
					//connect shmdata to destination
					views.methods.setMethod("defaultrtp", "add_udp_stream_to_dest", [path, destName, port], function(ok){
						console.log("uridecodebin remote", destName);
						
						setTimeout(function()
							{
								views.methods.setMethod("soapClient-"+destName, "invoke1", [config.nameComputer, 'to_shmdata', 'http://'+config.host+':'+config.port.soap+'/sdp?rtpsession=defaultrtp&destination='+destName],
									function(ok){
										console.log("ok?", ok);
									})
							},2000)

						
					});
					
					

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

				$("#panelRight").show();
				// $("#panelLeft").animate({width : "70%"});
				// $("#panelRight").delay(100).animate({width : "30%"});
			},
			closePanel : function(e)
			{

				$("#panelRight").hide();
				// $("#panelLeft").delay(100).animate({width : "100%"});
				// $("#panelRight").animate({width : "0px"});
			},
			closePanelInfoSource : function()
			{
				$(".panelInfoSource").remove();
			},
			keyboardAction : function(event)
			{
				var that = this;
			    if(event.which == 27) 	$("#panelRight").hide();
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
					if(collections.irc.active)
					{
						var modelIrc = collections.irc.get($(".channel.active").attr("id"));
						modelIrc.set({active : true});
						collections.irc.totalMsg = collections.irc.totalMsg - modelIrc.get("msgNotView");
						modelIrc.set({msgNotView : 0});
					}
				}
				else
				{
					$("#chat").hide();	
					this.statePanelIrc = false;
					collections.irc.each(function(channel){ channel.set({active : false}) });
				}
			},
			save : function()
			{
				console.log("ask for saving");
				socket.emit("save", "save.scenic", function(ok)
				{
					console.log("save return :", ok);
				})

			},
			load_from_scratch : function()
			{
				console.log("ask for load history from scratch");
				socket.emit("load_from_scratch", "save.scenic", function(ok)
				{
					if(ok)
					{
						collections.destinations.fetch
						({
							success : function(response)
							{
								//generate destinations
								$("#destinations").html("");
								collections.destinations.render();
								views.destinations.displayTitle();
								$("#sources").html("");
								collections.quidds.fetch();
							}
						});
					}

					console.log("load from scratch return :", ok);
				})
			},
			load_from_current_state : function()
			{
				console.log("ask for load history from current state");
				socket.emit("load_from_current_state", "save", function(ok)
				{
					console.log("load from current state return :", ok);
				})
			},
			panelLog : function()
			{
				var that = this;
				if(!this.statePanelLog)
				{
					$("#log").animate({"right" : 0}, function()
					{
						//console.log("open");
						that.statePanelLog = true;
					});
				}
				else
				{
					$("#log").animate({"right" : -$("#log").width()-61}, function()
					{
						that.statePanelLog = false;
					});
				}
				
			},
			panelInfo : function()
			{
				if(!this.statePanelInfo)
				{
					var template = _.template(panelInfoTemplate, {username : config.nameComputer, host : config.host, soap : config.port.soap });
					$("#btn-info").after(template);
					this.statePanelInfo = true;
				}
				else
				{
					$("#panelInfo").remove();
					this.statePanelInfo = false;
				}	
			},
			showActions : function(event)
			{
				$(".actions",event.target).css("display", "table").animate({opacity : 1}, 200);
			},
			hideActions : function(event)
			{
				$(".actions", event.currentTarget).animate({opacity : 0},200).css("display" , "none");
			},
			showTable : function(event)
			{
				var table = $(event.target).data("type");
				$(".tabTable").removeClass("active");
				$(event.target).addClass("active");
				$(".table").hide();
				$("#"+table).show();
			}
		});

		return MenuView;
	})