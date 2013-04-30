define([
	'underscore',
	'backbone',
	"text!/templates/channel-irc.html"
	],function(_, Backbone, TemplateChannel){

		var ircView = Backbone.View.extend({
			//el : '#chat',
			tagName : "div",
			className : "channel",
			events : {
				"keypress .value-input-msg" : "send_msg"
			},
			initialize : function()
			{
				var that = this;

				this.model.bind("change:users", this.setListUsers, this);

				//add to the top the channel
				$("#chat .headerMenu li").removeClass("active");
				$("#chat .headerMenu").append('<li class="channel active" id='+this.model.get("channel")+' >#'+this.model.get("channel")+'<span class="newMsg">2</span></li>');
				
				//listen outside of element associate to the view (for the menu)
				$("#"+this.model.get("channel")).click(function(){ that.showChannel(this) })

				//create box for message
				var html = _.template(TemplateChannel, { channel : this.model.get("channel"), username : this.model.get("username")})
				$(this.el).append(html).attr("id", this.model.get("channel"));
				$("#channels").append($(this.el));

			},
			showChannel : function(event)
			{
				$("#chat .headerMenu li").removeClass("active");
				$(event).addClass("active");
				$("#channels .channel").hide();
				$(this.el).show();
			},
			send_msg : function(event)
			{
				if(event.which == 13) //touch enter
				{
					var msg = $(".value-input-msg", this.el).val();
					$(".value-input-msg", this.el).val("");
					collections.irc.addMessage(this.model.get("channel"), this.model.get("username") ,msg);
					collections.irc.sendMessage(this.model.get("channel"), msg);
				}
			},
			setListUsers : function()
			{
				console.log("refresh connected");
				var usersConnected = this.model.get("users")
				,	listConnected = ""
				,	channel = this.model.get("channel");

				//update nb connected
				$(".nb-connected", this.el).html(_.size(usersConnected));
				//$("#chat .headerMenu #"+channel+" .newMsg").html(connected.length);

				//update list connected
				_.each(usersConnected, function(name){ listConnected+="<li>"+name+"</li>"; });
				$(".list-connected", this.el).html(listConnected);
			}
		});

		return ircView;
	});