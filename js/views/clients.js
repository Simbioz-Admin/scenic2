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

				create: function() {
					var name = $("#clientName").val(),
						host_name = $("#clientHost").val(),
						port_soap = $("#clientSoap").val();

					collections.clients.create(name, host_name, port_soap);
					views.global.closePanel();
					return false;
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
							destName = $(element.target).closest("td").data("hostname"),
							path = $(element.target).closest("tr").data("path"),
							port = $(element.target).val(),
							model = this.collection.get(destName),
							that = this;

						//add to the session the shmdata 
						socket.emit("invoke", "defaultrtp", "add_data_stream", [path], function(ok) {
							console.log("data added to stream");
						});
						//connect shmdata to destination
						console.log("add_udp_stream_to_dest", path, destName, port);
						socket.emit("invoke", "defaultrtp", "add_udp_stream_to_dest", [path, destName, port], function(ok) {
							console.log("uridecodebin remote", destName);

							//check if its soapClient
							socket.emit("get_quiddity_description", "soapClient-" + destName, function(description) {
								if (description.name) {
									setTimeout(function() {
										socket.emit("invoke", "soapClient-" + destName, "invoke1", [config.nameComputer, 'to_shmdata', 'http://' + config.host + ':' + config.port.soap + '/sdp?rtpsession=defaultrtp&destination=' + destName],
											function(ok) {
												console.log("ok?", ok);
											});
									}, 2000);
								}
							});

							that.removeInputDestination(element);
						});
					}
				},


				/* removes the input who we defined the port */

				removeInputDestination: function(element) {
					$(element.target).parent().parent().html("");
				}
			});

		return DestinationsView;
	})