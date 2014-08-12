module.exports = function(io, $, log, config) {
	var irc = require('irc');
	var usersIrc = [];
	var idChannelIrc = null;

	var clients = {};



	io.sockets.on('connection', function(socket) {

	
		socket.on("createClient-irc", function(username, channel, callback) {
			//define unique ID for channel irc private
			if (!idChannelIrc) idChannelIrc = "#scenic_" + channel;

			usersIrc[socket.id] = new User(username, socket, callback);
			usersIrc[socket.id].join(idChannelIrc);
			usersIrc[socket.id].join("#scenic");

		});


		socket.on("join-irc", function(channel) {
			usersIrc[socket.id].join(channel);
		});


		socket.on("sendMsg-irc", function(target, msg) {
			log.debug("msg for irc :", target, msg);
			usersIrc[socket.id].send(target, msg);
		});

		socket.on("disconnect", function(){
			if(usersIrc[socket.id]){
				usersIrc[socket.id].disconnect();
			}
		});
	});



	function User(username, socket, callback) {

		var username = username
		,	socket = socket;

		client = new irc.Client('irc.freenode.net', username, {
			autoConnect: false,
			channels: ['#scenic', idChannelIrc],
		});

		client.connect(function(info) {
			log.debug("CONNECT ! : ", info.args[0]);
			callback(info.args[0]);
		});

		this.join = function(channel) {
			log.debug("ask for joining : ", channel);
			client.join(channel, function(realUsername) {
				log.debug(realUsername, "is connected now!");
				socket.emit("join-irc", channel.replace("#", ""));
				//client.list();
			});
		}

		this.send = function(target, msg) {
			client.say(target, msg);
		}


		//receive message from all
		client.addListener('message', function(from, to, message, info) {
			log.debug("message : ", from, to, message, info)

			socket.emit("receiveMsg-irc", from, to, message);
		});


		client.addListener('pm', function(from, message, info) {
			log.debug("pm : ", from, message, info);
			//socket.emit("receiveMsg-irc", from, message, "priv");
		});


		client.addListener('notice', function(from, message, info) {
			log.debug("notice : ", from, message, info);
			if (!from) {
				var from = "info";
				var message = info;
			}
			//socket.emit("receiveMsg-irc", from, message, "priv");
		});


		//receive list names on channel and send to the interface
		client.addListener('names', function(channel, names) {
			log.debug(channel, names);
			var users = [];
			$.each(names, function(name) {
				users.push(name)
			});
			log.debug("list-users-irc", users);
			socket.emit("list-users-irc", channel, users);
		});

		client.addListener('join', function(channel, name) {
			log.debug(name, "as joined " + channel);
			socket.emit("add-user-irc", channel, name);
			socket.emit("receiveMsg-irc", "info", channel, name + " as joined");
		});

		client.addListener('part', function(channel, name) {
			log.debug(name, "as quit " + channel);
			socket.emit("remove-user-irc", channel, name);
			socket.emit("receiveMsg-irc", "info", channel, name + " as quit");
		});

		//for message error
		client.addListener('error', function(message) {
			log.error(message);
		});

		this.disconnect = function() {
			client.disconnect();
		}

		//this.join = function(target )
	}

};