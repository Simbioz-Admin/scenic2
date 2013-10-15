module.exports = function(io, $, log) {
	var irc = require('irc');
	var usersIrc = [];
	var idChannelIrc = null;



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
			log("info", "msg for irc :", target, msg);
			usersIrc[socket.id].send(target, msg);
		});
	});



	function User(username, socket, callback) {

		var username = username,
			socket = socket,
			client = new irc.Client('irc.freenode.net', username, {
				autoConnect: false,
				channels: ['#scenic', idChannelIrc],
			});

		client.connect(function(info) {
			log("info", "CONNECT ! : ", info.args[0]);
			callback(info.args[0]);
		});

		this.join = function(channel) {
			log("info", "ask for joining : ", channel);
			client.join(channel, function(realUsername) {
				log("info", realUsername, "is connected now!");
				socket.emit("join-irc", channel.replace("#", ""));
				//client.list();
			});
		}

		this.send = function(target, msg) {
			client.say(target, msg);
		}


		//receive message from all
		client.addListener('message', function(from, to, message, info) {
			log("info", "message : ", from, to, message, info)

			socket.emit("receiveMsg-irc", from, to, message);
		});


		client.addListener('pm', function(from, message, info) {
			log("info", "pm : ", from, message, info);
			//socket.emit("receiveMsg-irc", from, message, "priv");
		});


		client.addListener('notice', function(from, message, info) {
			log("info", "notice : ", from, message, info);
			if (!from) {
				var from = "info";
				var message = info;
			}
			//socket.emit("receiveMsg-irc", from, message, "priv");
		});


		//receive list names on channel and send to the interface
		client.addListener('names', function(channel, names) {
			log("info", channel, names);
			var users = [];
			$.each(names, function(name) {
				users.push(name)
			});
			log("info", "list-users-irc", users);
			socket.emit("list-users-irc", channel, users);
		});

		client.addListener('join', function(channel, name) {
			log("info", name, "as joined " + channel);
			socket.emit("add-user-irc", channel, name);
			socket.emit("receiveMsg-irc", "info", channel, name + " as joined");
		});

		client.addListener('part', function(channel, name) {
			log("info", name, "as quit " + channel);
			socket.emit("remove-user-irc", channel, name);
			socket.emit("receiveMsg-irc", "info", channel, name + " as quit");
		});

		//for message error
		client.addListener('error', function(message) {
			log("info", 'error: ', message);
		});

		//this.join = function(target )
	}

};