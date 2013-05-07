define([
	'underscore',
	'backbone',
	"text!/templates/msg_irc.html"
	],function(_, Backbone, TemplateMsg){

		var ircView = Backbone.View.extend({
			el : '#chat',
			userPrivate : null,
			username : null,
			usersConnected : [],
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

				socket.on("list-users", function(names)
				{
					that.setListUsers(names);
				});

				socket.on("add-user", function(name)
				{
					that.addlistUser(name);

				});

				socket.on("remove-user", function(name)
				{
					that.removeListUser(name);
					
				});
			},
			connect : function()
			{
				var username = $("#username-chat").val();
				that = this;
				console.log("ask for connection to irc with : ", username);
				socket.emit("connect-irc", username, function(user)
				{	
					that.username = user;
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
						socket.emit("sendMsg-irc", this.userPrivate, msg);
						this.add_msg($("#your-user").html(), msg, this.userPrivate);
					}
					else
					{
						socket.emit("sendMsg-irc", "#scenicTest", msg);
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
			setListUsers : function(names)
			{
				var nbConnected = parseInt($("#nb-connected").html());

				_.each(names, function(index, name)
				{
					if($("#list-names [data-username='"+name+"']").length == 0)
					{
						$("#list-names").append("<li class='user' data-username='"+name+"'>"+name+"</li>");
						nbConnected++;
						
					}
				});
				$("#nb-connected").html(nbConnected);
			},
			addlistUser : function(name)
			{
				if($("#list-names [data-username='"+name+"']").length == 0)
				{
					var nbConnected = parseInt($("#nb-connected").html());
					$("#list-names").append("<li class='user' data-username='"+name+"'>"+name+"</li>");
					$("#nb-connected").html(nbConnected+1);
					this.add_msg("info", name+" as joined the channel #scenic", "public");
				}
				
			},
			removeListUser : function(name)
			{
				var nbConnected = parseInt($("#nb-connected").html());
				$("#list-names [data-name='"+name+"']").remove();
				$("#nb-connected").html(nbConnected-1);
				this.add_msg("info", name+" as quit the channel #scenic", "public");
			},
			selectPrivateUser : function(){

				$("#userPrivate").remove();
				$("#value-input-msg").removeAttr("style");
				var userPrivate = $(event.target).data("username");
				console.log(this.username, userPrivate);
				if(userPrivate != this.username && userPrivate != "info" && userPrivate != "")
				{
					this.userPrivate = userPrivate;
					$("#value-input-msg").after('<div id="userPrivate"><div id="remove-userPrivate">x</div>'+this.userPrivate+'</div>')
					var sizeSticky = $("#userPrivate").outerWidth()+5;
					$("#value-input-msg").css({paddingLeft : sizeSticky, width : $("#value-input-msg").width()-sizeSticky+5 });
				}
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