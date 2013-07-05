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
				this.model.bind("change:msgNotView", this.countMsg, this);


				//add to the top the channel
				$("#chat .headerMenu li").removeClass("active");
				$("#chat .headerMenu").append('<li class="channel active" id='+this.model.get("channel")+' >#'+this.model.get("channel")+'<span class="countMsgIrc"></span></li>');
				
				//listen outside of element associate to the view (for the menu)
				$("#"+this.model.get("channel")).click(function(){ that.showChannel(this) })

				//create box for message
				var html = _.template(TemplateChannel, { channel : this.model.get("channel"), username : this.model.get("username")})
				$(this.el).append(html).attr("id", this.model.get("channel"));
				$("#channels").append($(this.el));

			},
			showChannel : function(event)
			{
				//remove satus for the channel
				$("#chat .headerMenu li").removeClass("active");
				collections.irc.each(function(channel){ channel.set({active : false}) });
				this.model.set({active : true});
				$(event).addClass("active");


				collections.irc.totalMsg = collections.irc.totalMsg - this.model.get("msgNotView");
				this.model.set({msgNotView : 0});


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
			},
			countMsg : function()
			{
				if(this.model.get("msgNotView") == 0)
				{
					$("#"+this.model.get("channel")+" .countMsgIrc").html("").hide();
					if(collections.irc.totalMsg <= 0)
					{
						collections.irc.totalMsg = 0;
						$("#btn-irc .countMsgIrc").hide();
					}
				}
				else
				{
					collections.irc.totalMsg += 1;
					$("#btn-irc .countMsgIrc").html(collections.irc.totalMsg).show();
					$("#"+this.model.get("channel")+" .countMsgIrc").html(this.model.get("msgNotView")).show();
				}
			}
		});

		return ircView;
	});