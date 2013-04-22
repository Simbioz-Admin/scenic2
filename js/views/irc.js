define([
	'underscore',
	'backbone',
	"text!/templates/msg_irc.html"
	],function(_, Backbone, TemplateMsg){

		var ircView = Backbone.View.extend({
			el : '#chat',
			events : {
				"click #submit-chat" : "connect",
				"keypress #value-input-msg" : "send_msg"

			},
			initialize : function()
			{
				console.log("init chat-irc");
				var that = this;
				socket.on("receiveMsg-irc", function(user, msg)
				{	
					that.add_msg(user, msg);
				});
			},
			connect : function()
			{
				var username = $("#username-chat").val();
				console.log("ask for connection to irc with : ", username);
				socket.emit("connect-irc", username, function(user)
				{	
					$("#your-user").html(user);
					$("#chat #login").hide();
					$("#chat #connect-chat").show();
				});

				$("#login").html("Please, wait...");
				

				return false;
			},
			send_msg : function(event)
			{
				if(event.which == 13) {
					var msg = $("#value-input-msg").val();
					$("#value-input-msg").val("");
					socket.emit("sendMsg-irc", msg);
					this.add_msg($("#your-user").html(), msg);

				}
			},
			add_msg : function(user, msg)
			{
				var message = _.template(TemplateMsg, {user : user, msg : msg});
				$("#content-chat").append(message);

				var objDiv = document.getElementById("content-chat");
				objDiv.scrollTop = objDiv.scrollHeight;

			}

		});

		return ircView;
	});