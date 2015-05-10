define([
    'underscore',
    'backbone',
    'socket',
    'models/channel-irc',
    'text!../../templates/msg_irc.html'
], function(_, Backbone, socket, ChannelModel, TemplateMsg) {

    var ChannelsCollection = Backbone.Collection.extend({
        model: ChannelModel,
        username: null,
        totalMsg: 0,
        active: false,
        initialize: function() {
            var that = this;
            //create standard channel IRC (#scenic / #scenic_idNodeServer)
            socket.on("join-irc", function(channel) {
                that.each(function(channel) {
                    channel.set({
                        active: false
                    });
                });
                that.add({
                    active: true,
                    channel: channel,
                    username: that.username
                });
                that.active = true;

                //at the first connection in memories the id.socket for identification on server
                // if(!$.cookie('id_client')){
                //   console.log("we memories id.socket", socket.socket.sessionid);
                // }


                $("#chat #login").hide();
            });

            socket.on("receiveMsg-irc", function(from, to, msg) {
                that.addMessage(to, from, msg);
            });

            socket.on("list-users-irc", function(channel, names) {
                that.setListUsers(channel, names);
            });

            socket.on("add-user-irc", function(channel, name) {
                that.addlistUser(channel, name);
            });

            socket.on("remove-user-irc", function(channel, name) {
                that.removelistUser(channel, name);
            });


            $("#submit-chat").click(function() {
                that.connectClient();
                return false;
            });

            $("#chat").draggable({
                cursor: "move",
                handle: ".title"
            });

        },
        connectClient: function() {
            var username = $("#username-chat").val();
            var channel = $("#channel-chat").val();

            that = this;
            socket.emit("createClient-irc", username, channel, function(user, channel) {
                that.username = user;
                console.log(that.username, "is connected now");
                $("#your-user").html(user);
                $("#channels").show();

            });

            $("#login").html("<div id='loading'>Please, wait...</div>");
        },
        sendMessage: function(channel, msg) {
            socket.emit("sendMsg-irc", "#" + channel, msg);
        },
        addMessage: function(chann, user, msg) {

            //increment number message not view for the channel
            var channel = this.get(chann.replace("#", ""));
            if (channel && !channel.get("active")) channel.set({
                msgNotView: channel.get("msgNotView") + 1
            });

            var message = _.template(TemplateMsg)( {
                user: user,
                msg: msg
            });
            $("#" + chann.replace("#", "") + " .content-channel").append(message);

            //TODO : FIX AUTO SCROLL
            // var objDiv = document.getElementById(channel.replace("#",""));
            // objDiv.scrollTop = objDiv.scrollHeight;

        },
        setListUsers: function(channel, names) {
            var channel = this.get(channel.replace("#", ""));
            channel.set({
                users: names
            });
        },
        addlistUser: function(channel, name) {

            //var users = this.get(channel).get("users");
            //users.push(name);
            var model = this.get(channel.replace("#", ""));
            if (model) {
                var newUsers = _.clone(model.get("users"));
                newUsers.push(name);
                model.set("users", newUsers);
            }
        },
        removelistUser: function(channel, name) {
            var model = this.get(channel.replace("#", ""));
            var users = _.clone(model.get("users"));
            var index = users.indexOf(name);
            users.splice(index, 1);
            model.set("users", users);
            console.log(users);
        }
    });

    return ChannelsCollection;
})