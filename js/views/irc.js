define([
	'underscore',
	'backbone',
	"text!/templates/msg_irc.html"
	],function(_, Backbone, TemplateMsg){

		var ircView = Backbone.View.extend({
			el : '#chat',
			userPrivate : null,
			events : {
				"click #submit-chat" : "connect",
				"keypress #value-input-msg" : "send_msg",
				"click .user" : "selectPrivateUser",
				"click #remove-userPrivate" : "removePrivateUser"

			},
			initialize : function()
			{
				console.log("init chat-irc");
				var that = this;
				socket.on("receiveMsg-irc", function(user, msg, type)
				{	
					that.add_msg(user, msg, type);
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

					if(this.userPrivate)
					{
						socket.emit("sendMsgPrivate-irc", this.userPrivate, msg);
						this.add_msg($("#your-user").html(), msg, this.userPrivate);
					}
					else
					{
						console.log("SEND : ", msg);
						socket.emit("sendMsg-irc", msg);
						this.add_msg($("#your-user").html(), msg, "public");
					}

					

				}
			},
			add_msg : function(user, msg, userPrivate)
			{
				var message = _.template(TemplateMsg, {user : user, msg : msg, type : userPrivate});
				$("#content-chat").append(message);

				var objDiv = document.getElementById("content-chat");
				objDiv.scrollTop = objDiv.scrollHeight;

			},
			selectPrivateUser : function(){

				$("#userPrivate").remove();
				this.userPrivate = $(event.target).data("username");

				$("#value-input-msg").after('<div id="userPrivate"><div id="remove-userPrivate">x</div>'+this.userPrivate+'</div>')
										
				var sizeSticky = $("#userPrivate").outerWidth()+5;
				$("#value-input-msg").css({paddingLeft : sizeSticky, width : $("#value-input-msg").width()-sizeSticky+5 });
			},
			removePrivateUser : function(event)
			{
				this.userPrivate = null;
				$(event.target).parent().remove();
				$("#value-input-msg").removeAttr("style");
			}

		});

		return ircView;
	});