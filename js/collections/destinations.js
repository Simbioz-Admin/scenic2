define(

	/** 
	 *	A module for creating collection of clients
	 *	@exports collections/clients
	 */


	[
		'underscore',
		'backbone',
		'models/destination',
	],

	function(_, Backbone, DestinationModel) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires DestinationModel
		 *  @augments module:Backbone.Collection
		 */

		var DestinationsCollection = Backbone.Collection.extend(

			/**
			 *	@lends module:collections/clients~DestinationsCollection.prototype
			 */

			{

				model: DestinationModel,
				url: '/quidds/dico/properties/destinations/values/',
				timer : 5000,
				parse: function(results, xhr) {
					return results;
				},

				/** Initialization of the clients collection
				 *	We declare all events for receive information about clients
				 */

				initialize: function() {

					var that = this;

					/** Event called when the server add a new destination (client) */
					socket.on("create_destination", function(destination) {
						that.add(destination);
						console.log(that);
						// views.global.notification("info", "the destination " + destination.name + " is added");
					});

					/** Event called when the server has removed a destination (client) */
					socket.on("remove_destination", function(id) {
						var model = that.get(id);
						//console.log("REMOVE", model);
						model.trigger('destroy', model, that);
						$("[data-hostname='" + model.get("name") + "']").remove();
						// views.global.notification("info", "Destination " + name + " is deleted");
					});

					/** Event called when a connection is made between a source and a destination */
					socket.on("add_connection", function(invoke, quiddName, parameters) {
						$("[data-path='" + parameters[0] + "'] [data-hostname='" + parameters[1] + "']").addClass("active");
					})

					/** Event called when a connection between a source and a destination is removed  */
					socket.on("remove_connection", function(invoke, quiddName, parameters) {
						$("[data-path='" + parameters[0] + "'] [data-hostname='" + parameters[1] + "']").removeClass("active");
					})

				},


				/**
				 *	Rendering destinations once the destinations have been added to the collection Destinations
				 */

				render: function() {
					collections.destinations.each(function(model) {
						var view = new ViewDestination({
							model: model
						});
					});
				},


				/**
				 *	Ask to switcher to create a destination
				 *	At the same time we see if the server is added to a SOAP server, if this is
				 *	the case we create a quiddity on the destination computer to add sources that are sent
				 *	@param {string} clientName Username or remote server name
				 *	@param {string} clientHost adress ip or hostname
				 *	@param {int} [portSoap]  the port of the remote server switcher
				 */

				create: function(clientName, clientHost, portSoap) {
					var that = this;


					// socket.emit("invoke", "defaultrtp", "add_destination", [clientName, clientHost], function(ok) {

					// 	console.log(ok, clientName, clientHost);

					// 	/* add destination to the dico for stock data  */
					// 	socket.emit("get_property_value","dico", "destinations", function(destinations) {
					// 		console.log("value Destinations", destinations);
					// 		var destination = {
					// 			name : clientName,
					// 			host : clientHost,
					// 			comment : "blahblah"
					// 		}

					// 		socket.emit("setPropertyValue", "dico", "destinations", JSON.stringify(destination), function(property, value) {
					// 			console.log("Control insert destination Dico ", property, value);
					// 		});
					// 	});
					// 	//** set connection with another scenic computer if the port soap is define **/
					// 	if (portSoap) {
					// 		if (clientHost.indexOf("http://") < 0) clientHost = "http://" + clientHost;
					// 		var soapClient = "soapClient-" + clientName,
					// 			addressClient = clientHost + ":" + portSoap;

					// 		/**  create quiddity SOAPcontrolClient for control the remote switcher server */
					// 		socket.emit("create", "SOAPcontrolClient", soapClient, function(quiddInfo) {

					// 			if (quiddInfo) {

					// 				that.connectSOAP(soapClient, addressClient)
					// 			}
					// 		});
					// 	}

					// });
				},


				/**
				 *	Called for connect SoapClient
				 *	if the port soap not respond we retry with increasingly large
				 *	@param {int} soapClient port of SOAP client
				 *	@param {string} address Client
				 */

				// connectSOAP: function(soapClient, addressClient) {

				// 	socket.emit("invoke", soapClient, "set_remote_url_retry", [addressClient], function(ok) {
						
				// 		if (ok == "true") {
				// 			views.global.notification("info", "scenic server detected");
				// 			socket.emit("invoke", soapClient, "create", ["httpsdpdec", config.nameComputer]);
				// 			collections.destinations.get(clientName).set("soapClient", true);
				// 		}

				// 	});
				// }
			});

		return DestinationsCollection;
	})