module.exports = function (io, $) {
	var irc = require('irc');
	var usersIrc = [];
	var idChannelIrc = null;



	io.sockets.on('connection', function (socket)
	{



		socket.on("createClient-irc", function(username, channel, callback)
		{
			//define unique ID for channel irc private
			if(!idChannelIrc) idChannelIrc = "#scenic_"+channel;

			usersIrc[socket.id] = new User(username, socket, callback);
			usersIrc[socket.id].join(idChannelIrc);
			usersIrc[socket.id].join("#scenic");

		});


		socket.on("join-irc", function(channel)
		{
			usersIrc[socket.id].join(channel);
		});


		socket.on("sendMsg-irc", function(target, msg){
			console.log("msg for irc :",target,  msg);
			usersIrc[socket.id].send(target, msg);
		});
	});




	function User(username, socket, callback)
	{

		var username = username
		,	socket = socket
		,	 client = new irc.Client('irc.freenode.net', username, {
				autoConnect: false,
    			channels: ['#scenic', idChannelIrc],
		});
		
		client.connect(function(info){
			console.log("CONNECT ! : ", info.args[0]);
			callback(info.args[0]);
		});

		this.join = function(channel)
		{
			console.log("ask for joining : ", channel);
			client.join(channel, function(realUsername)
			{
				console.log(realUsername, "is connected now!");
				socket.emit("join-irc", channel.replace("#", ""));
				//client.list();
			});
		}

		this.send = function(target, msg){ client.say(target, msg); }

		
		//receive message from all
		client.addListener('message', function (from, to, message, info) {
			console.log("message : ", from, to, message, info)

			socket.emit("receiveMsg-irc", from, to, message);
		});


		client.addListener('pm', function (from, message, info)
		{
			console.log("pm : ", from, message, info);
			//socket.emit("receiveMsg-irc", from, message, "priv");
		});


		client.addListener('notice', function (from, message, info) {
			console.log("notice : ", from, message, info);
			if(!from)
			{
				var from = "info";
				var message = info;
			}
			//socket.emit("receiveMsg-irc", from, message, "priv");
		});


		//receive list names on channel and send to the interface
		client.addListener('names', function (channel, names) {
			console.log(channel, names);
			var users = [];
			$.each(names, function(name){ users.push(name)});
			console.log("list-users-irc",users);
			socket.emit("list-users-irc",channel, users);
		});

		client.addListener('join', function (channel, name) {
			console.log(name, "as joined "+channel);
			socket.emit("add-user-irc", channel, name);
			socket.emit("receiveMsg-irc", "info", channel, name+" as joined");
		});

		client.addListener('part', function (channel, name) {
			console.log(name, "as quit "+channel);
			socket.emit("remove-user-irc",channel, name);
			socket.emit("receiveMsg-irc", "info", channel, name+" as quit");
		});

		//for message error
		client.addListener('error', function(message)
		{
		    console.log('error: ', message);
		});

		//this.join = function(target )
	}

};