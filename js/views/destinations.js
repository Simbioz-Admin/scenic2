define(

	/** 
	 *	View Clients
	 *	Manage interaction global with clients
	 *	@exports Views/Clients
	 */

	[
		'underscore',
		'backbone',
		'text!/templates/createClient.html'
	],

	function(_, Backbone, templateCreateClient) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *  @requires templateCreateClient
		 *  @augments module:Backbone.Model
		 */

		var DestinationsView = Backbone.View.extend(

			/**
			 *	@lends module: Views/Clients~DestinationsView.prototype
			 */

			{
				el: 'body',
				events: {
					"click #create-client": "openPanel",
					"click #add-client": "create",
					"click .connect-client": "connection",
					"keypress #port_destination": "setConnection",
					"blur #port_destination": "removeInputDestination"
				},


				/* Called when the table is initialized and create a view */

				initialize: function() {
					this.displayTitle();
				},


				/* Displays the panel to create a new destination */

				openPanel: function() {
					var template = _.template(templateCreateClient);
					$("#panelRight .content").html(template);
					views.global.openPanel();
				},


				/* Creates a new destination  */

				create: function(e) {
					e.preventDefault();

					var destination = {
						name : $("#clientName").val(),
						hostName : $("#clientHost").val(),
						portSoap : $("#clientSoap").val()
					}

					//collections.destinations.create(name, host_name, port_soap);

					socket.emit("create_destination", destination , function(data) {
						console.log(data);
						if (data.error) {
							return views.global.notification("error", data.error);
						}
						views.global.notification("info", data.success);
						views.global.closePanel();
					});
		
				},


				/* Displays the title of destination */

				displayTitle: function() {
					if (this.collection.size() != 0) $("#titleOut").show();
					else $("#titleOut").hide();
				},

				/* Show a box for set a connection between destination and source */

				connection: function(element) {
					var box = $(element.target),
						destName = box.data("hostname"),
						path = box.parent().data("path");

					if (box.hasClass("active")) {
						socket.emit("invoke", "defaultrtp", "remove_udp_stream_to_dest", [path, destName], function(ok) {});
					} else {
						box.html("<div class='content-port-destination' ><input id='port_destination' autofocus='autofocus' type='text' placeholder='define port'></div>");
					}
				},

				/* Asks the server to connect a source to a destination, it's trigger when the user define a port and press enter  */

				setConnection: function(element) {

					if (element.which == 13) //touch enter
					{
						var box = $(element.target).parent(),
							id = $(element.target).closest("td").data("id"),
							path = $(element.target).closest("tr").data("path"),
							port = $(element.target).val(),
							portSoap = this.collection.get(id).get("portSoap"),
							that = this;

						console.log(id, path, port, portSoap );
						socket.emit("connect_destination", path, id, port, portSoap, function(ok) {
							console.log("connect destination", ok);
						});
					}
					// 	//add to the session the shmdata 
					// 	socket.emit("invoke", "defaultrtp", "add_data_stream", [path], function(ok) {

					// 	});
					// 	//connect shmdata to destination

					// 	socket.emit("invoke", "defaultrtp", "add_udp_stream_to_dest", [path, id, port], function(ok) {
					// 		console.log("success add udp stream to dest");

					// 		//check if its soapClient
					// 		socket.emit("get_quiddity_description", "control-" + id, function(description) {
					// 			console.log(description);

					// 			if (description.name) {
					// 				setTimeout(function() {
					// 					console.log('http://' + config.host + ':' + config.port.soap + '/sdp?rtpsession=defaultrtp&destination=' + id);
					// 					socket.emit("invoke", "control-" + id, "invoke1", [config.nameComputer, 'to_shmdata', 'http://' + config.host + ':' + config.port.soap + '/sdp?rtpsession=defaultrtp&destination=' + id],
					// 						function(ok) {
					// 							console.log("OK", ok)
					// 						});
					// 				}, 1000);
					// 			}
					// 		});

					// 		that.removeInputDestination(element);
					// 	});
					// }
				},


				/* removes the input who we defined the port */

				removeInputDestination: function(element) {
					$(element.target).parent().parent().html("");
				}
			});

		return DestinationsView;
	})