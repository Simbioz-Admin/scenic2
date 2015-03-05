define(

  /** 
   *  View Irc
   *  Manage intercation with the user and a channel irc
   *  @exports Views/Irc
   */

  [
    'underscore',
    'backbone',
    "text!../../templates/channel-irc.html"
  ],


  function(_, Backbone, TemplateChannel) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires TemplateChannel
     *  @augments module:Backbone.View
     */

    var ircView = Backbone.View.extend(

      /**
       *  @lends module: Views/Irc~ircView.prototype
       */

      {
        tagName: "div",
        className: "channel",
        events: {
          "keypress .value-input-msg": "send_msg",
        },


        /* Called when the view is initialized */

        initialize: function() {
          var that = this;
          /* Subscribe to the modification about users and message not view */
          this.model.bind("change:users", this.setListUsers, this);
          this.model.bind("change:msgNotView", this.countMsg, this);


          //add to the top the channel
          $("#chat .headerMenu li").removeClass("active");
          $("#chat .headerMenu").append('<li class="channel active" id=' + this.model.get("channel") + ' >#' + this.model.get("channel") + '<span class="countMsgIrc"></span></li>');

          //listen outside of element associate to the view (for the menu)
          $("#" + this.model.get("channel")).click(function() {
            that.showChannel(this)
          })

          //create box for message
          var html = _.template(TemplateChannel, {
            channel: this.model.get("channel"),
            username: this.model.get("username")
          })
          $(this.el).append(html).attr("id", this.model.get("channel"));
          $("#channels").append($(this.el));

        },

        /* Called for switch between the different channels irc */

        showChannel: function(event) {
          //set all channel to false for define current active
          $("#chat .headerMenu li").removeClass("active");
          collections.irc.each(function(channel) {
            channel.set({
              active: false
            })
          });
          this.model.set({
            active: true
          });
          $(event).addClass("active");

          collections.irc.totalMsg = collections.irc.totalMsg - this.model.get("msgNotView");
          this.model.set({
            msgNotView: 0
          });


          $("#channels .channel").hide();
          $(this.el).show();
        },

        /* Called for send a message to the active channel */

        send_msg: function(event) {
          if (event.which == 13) //touch enter
          {
            var msg = $(".value-input-msg", this.el).val();
            $(".value-input-msg", this.el).val("");
            collections.irc.addMessage(this.model.get("channel"), this.model.get("username"), msg);
            collections.irc.sendMessage(this.model.get("channel"), msg);
          }
        },

        /* Called when the list users is updated */

        setListUsers: function() {
          var usersConnected = this.model.get("users"),
            listConnected = "",
            channel = this.model.get("channel");

          //update nb connected
          $(".nb-connected", this.el).html(_.size(usersConnected));
          //$("#chat .headerMenu #"+channel+" .newMsg").html(connected.length);

          //update list connected
          _.each(usersConnected, function(name) {
            listConnected += "<li>" + name + "</li>";
          });
          $(".list-connected", this.el).html(listConnected);
        },

        /* Called when the number of message not view is updated */

        countMsg: function() {
          if (this.model.get("msgNotView") == 0) {
            $("#" + this.model.get("channel") + " .countMsgIrc").html("").hide();
            if (collections.irc.totalMsg <= 0) {
              collections.irc.totalMsg = 0;
              $("#btn-irc .content").removeClass("newMsg").html("");

            }
          } else {
            collections.irc.totalMsg += 1;
            $("#btn-irc .content").html(collections.irc.totalMsg).show();
            $("#btn-irc .content").addClass("newMsg");
            $("#" + this.model.get("channel") + " .countMsgIrc").html(this.model.get("msgNotView")).show();
          }
        }
      });

    return ircView;
  });