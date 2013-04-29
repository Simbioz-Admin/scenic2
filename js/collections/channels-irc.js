define([
	'underscore',
	'backbone',
	'models/channel-irc',
	'views/irc2',
	'text!/templates/msg_irc.html'
	],function(_, Backbone, ChannelModel, ViewIrc, TemplateMsg){

		var ChannelsCollection = Backbone.Collection.extend({
			model : ChannelModel,
			username : null,
		    initialize : function(){
		    	console.log("init collection channels-irc");
		    	var that = this; 
		    	socket.on("join-irc", function(channel)
		    	{
			    	//create standard channel IRC (#scenic / #scenic_idNodeServer)
			    	that.add({channel : channel, username : that.username});
		    	});

		    	socket.on("receiveMsg-irc", function(from, to, msg)
				{	
					console.log("Receive msg : ", from, to, msg);
					that.addMessage(to, from, msg);
				});

				$("#submit-chat").click(function()
				{  
					that.connectClient(); 
					return false;
				})

		    	// views.irc = new ViewIrc({collection : this});
		    	//this.connectClient();
		    },
		    connectClient : function()
			{
				var username = $("#username-chat").val();
				var channel = $("#channel-chat").val();

				that = this;
				socket.emit("createClient-irc", username, channel, function(user, channel)
				{	
					that.username = user;
					console.log(that.username, "is connected now");
					$("#your-user").html(user);
					$("#channels").show();
					$("#chat #login").hide();
				});

				$("#login").html("Please, wait...");
			},
			sendMessage : function(channel, msg)
			{
				socket.emit("sendMsg-irc", "#"+channel, msg);
			},
			addMessage : function(channel, user, msg)
			{
				var message = _.template(TemplateMsg, {user : user, msg : msg});
				$("#"+channel.replace("#","")+" .content-channel").append(message);


				//TODO : FIX AUTO SCROLL
				// var objDiv = document.getElementById(channel.replace("#",""));
				// objDiv.scrollTop = objDiv.scrollHeight;

			}
		});

		return ChannelsCollection;
	})