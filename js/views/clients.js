define([
	'underscore',
	'backbone',
	'text!/templates/createClient.html'
], function(_, Backbone, templateCreateClient) {

	var DestinationsView = Backbone.View.extend({
		el: 'body',
		events: {
			"click #create-client": "openPanel",
			"click #add-client": "create",
			"click .connect-client": "connection",
			"keypress #port_destination": "setConnection",
			"blur #port_destination": "removeInputDestination"
		},
		initialize: function() {
			console.log("init ClientsView");
			this.displayTitle();
		},
		openPanel: function() {
			var template = _.template(templateCreateClient);
			$("#panelRight .content").html(template);
			views.global.openPanel();
		},
		create: function() {
			var name = $("#clientName").val(),
				host_name = $("#clientHost").val(),
				port_soap = $("#clientSoap").val();

			collections.clients.create(name, host_name, port_soap);

			return false;
		},
		displayTitle: function() {
			//check number of quidd for titleIn
			if (this.collection.size() != 0) $("#titleOut").show();
			else $("#titleOut").hide();
		},
		connection: function() {
			var box = $(event.target),
				destName = box.data("hostname"),
				path = box.parent().data("path");

			if (box.hasClass("active")) {
				socket.emit("invoke", "defaultrtp", "remove_udp_stream_to_dest", [path, destName], function(ok) {});
			} else {
				box.html("<input id='port_destination' autofocus='autofocus' type='text' placeholder='define port'>");
			}
		},
		setConnection: function(event) {

			if (event.which == 13) //touch enter
			{
				var box = $(event.target).parent(),
					destName = box.data("hostname"),
					path = box.parent().data("path"),
					port = $(event.target).val(),
					model = this.collection.get(destName),
					that = this;


				console.log(model.get("soapClient"));

				//add to the session the shmdata 
				//views.methods.setMethod("defaultrtp", "add_data_stream", [path], function(ok){ console.log("data added to stream");});
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
							setTimeout(function(){
								socket.emit("invoke", "soapClient-" + destName, "invoke1", [config.nameComputer, 'to_shmdata', 'http://' + config.host + ':' + config.port.soap + '/sdp?rtpsession=defaultrtp&destination=' + destName],
									function(ok) {
										console.log("ok?", ok);
									});
							}, 2000);
						}
					});

					that.removeInputDestination(event);
				});
			}
		},
		removeInputDestination: function(event) {
			$(event.target).parent().html("");
		}
	});

	return DestinationsView;
})
