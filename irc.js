module.exports = function (io, socket, irc) {

	var Iconv = require('iconv').Iconv;
   

	var usersIrc = []
	,	channelIrc = "#scenicTest";

	function User(username, socket, callback)
	{
		//var socket = id;
		var username = username;

		var client = new irc.Client('irc.freenode.net', username, {
		    channels: [channelIrc],
		});

		client.join(channelIrc, function(realUsername){
			console.log(realUsername, "is connected now!");
			callback(realUsername);
			//client.list();

		});


		//for message error
		client.addListener('error', function(message) {
		    console.log('error: ', message);
		});

		//receive message from all
		client.addListener('message'+channelIrc, function (from, message, info) {
			console.log("message : ", from, message, info)

			socket.emit("receiveMsg-irc", from, message, "public");
		});


		client.addListener('pm', function (from, message, info) {
			console.log("pm : ", from, message, info);
			socket.emit("receiveMsg-irc", from, message, "priv");
		});

		client.addListener('notice', function (from, message, info) {
			console.log("notice : ", from, message, info);
			if(!from)
			{
				var from = "info";
				var message = info;
			}
			socket.emit("receiveMsg-irc", from, message, "priv");
		});


		//receive list names on channel and send to the interface
		client.addListener('names', function (channel, names) {
			console.log(channel, names);
			socket.emit("list-users", names);
		});

		client.addListener('join'+channelIrc, function (name) {
			console.log(name, "as joined "+channelIrc);
			socket.emit("add-user", name);
		});

		client.addListener('part'+channelIrc, function (name) {
			console.log(name, "as quit "+channelIrc);
			socket.emit("remove-user", name);
		});


		

		this.send = function(target, msg){ client.say(target, msg); }
		this.disconnect = function(){ client.part(channelIrc); }

		this.sendPrivate = function(userPrivate, msg)
		{
			client.ctcp(userPrivate, "NOTICE", msg);
		}

	}

	//usersIrc["pacman"].connectToIrc();


	socket.on("connect-irc", function(username, callback)
	{
		usersIrc[socket.id] = new User(username, socket, function(valid)
		{
			callback(valid);
		});
	});

	socket.on("disconnect", function()
	{
		console.log(socket.id+" disconnect");
		if(usersIrc[socket.id]) usersIrc[socket.id].disconnect();
	});

	socket.on("sendMsg-irc", function(target, msg){
		console.log("msg for irc :",target,  msg);
		usersIrc[socket.id].send(target, msg);
	});

	// socket.on("sendMsgPrivate-irc", function(userPrivate, msg){
	// 	console.log("msg for irc :", userPrivate, msg);
	// 	usersIrc[socket.id].sendPrivate(userPrivate, msg);
	// });





	// clientIrc = new irc.Client('irc.freenode.net', "pacmanNode", {
	//     channels: ['#scenicTest'],
	// });

	
	// clientIrc.addListener('error', function(message) {
	//     console.log('error: ', message);
	// });

	// clientIrc.join('#scenicTest');
	// //clientIrc.say('#scenic', "Test connection with Nodejs ! I'M super Pomme-de-terre!");

	// clientIrc.addListener('pm', function (from, message) {
	//     console.log(from + ' => ME: ' + message);
	//     io.sockets.emit("receiveMsg-irc", from, message);
	// });








};