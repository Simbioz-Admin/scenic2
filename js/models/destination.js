 define(

	/** 
	 *	Model of Client
	 *	The destination is a destination in table transfer 
	 *	@exports Models/destination
	 */

	[
		'underscore',
		'backbone',
		'views/destination',
		'views/editDestination'
	],

	function(_, Backbone, ViewDestination, ViewEditDestination) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires ViewDestination
		 *  @augments module:Backbone.Model
		 */

		var ClientModel = Backbone.Model.extend(

		/**
		 *	@lends module: Models/destination~ClientModel.prototype
		 */

			{
				// idAttribute: "name",
				defaults: {
					"id" : null,
					"name": null,
					"hostName": null,
					"portSoap": null
					// "data_streams": [],
					// "soapClient": false
				},


				/* Called when the table is initialized and create a view */

				initialize: function() {

					//we create automaticlly the view for destination based on ViewDestination
					var view = new ViewDestination({
						model: this,
						table: "transfer"
					});

					//check if it's SOAPClient if true we test a connection
					console.log("test connection SOAP", this);
				},

				/**
				 * Allows to ask for edit a specific destination
				 */

				 edit : function() {
				 	var that = this;
				 	console.log("EDIT", this.toJSON());
				 	new ViewEditDestination({
				 		model : that
				 	})
				 },

				/**
				 *	Allows to ask for remove a specific destination (destination)
				 */

				delete: function() {
					var that = this;

					var result = views.global.confirmation("Are you sure?", function(ok){
						if(ok){
							
							socket.emit("remove_destination", that.get("id"), that.get("portSoap"), function(data) {
								if(data.error) {
									return views.global.notifications("error", data.error);
								}
							});
							//socket.emit("invoke", "defaultrtp", "remove_destination", [that.get("name")], function(ok) {});
						}
					});
				}
			});

		return ClientModel;
	})