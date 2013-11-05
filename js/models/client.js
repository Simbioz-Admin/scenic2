define(

	/** 
	 *	Model of Client
	 *	The client is a destination in table transfer 
	 *	@exports Models/client
	 */

	[
		'underscore',
		'backbone',
		'views/destination'
	],

	function(_, Backbone, ViewDestination) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires ViewDestination
		 *  @augments module:Backbone.Model
		 */

		var ClientModel = Backbone.Model.extend(

		/**
		 *	@lends module: Models/client~ClientModel.prototype
		 */

			{
				idAttribute: "name",
				defaults: {
					"name": null,
					"host_name": null,
					"data_streams": [],
					"soapClient": false
				},


				/* Called when the table is initialized and create a view */

				initialize: function() {

					//we create automaticlly the view for client based on ViewDestination
					var view = new ViewDestination({
						model: this,
						table: "transfer"
					});
				},



				/**
				 *	Allows to ask for remove a specific client (destination)
				 */

				delete: function() {
					var result = confirm("Are you sure?");
					if (result == true) {
						socket.emit("invoke", "defaultrtp", "remove_destination", [this.get("name")], function(ok) {});
					}
				}
			});

		return ClientModel;
	})