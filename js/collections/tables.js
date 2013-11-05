define(

	/** 
     *	Manage the collection of table. By default we have table controler and transfer
     *	@exports collections/tables
 	 */

	[
		'underscore',
		'backbone',
		'models/table'
	],
	function(_, Backbone, ModelTable){

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires ModelTable
		 *  @augments module:Backbone.Collection
		 */

		var CollectionTables = Backbone.Collection.extend(

		/**
		 *	@lends module:collections/tables~CollectionTables.prototype
		 */

		{
			model: ModelTable,
			currentTable: config.defaultPanelTable,


			/** Execute when the collection is initialized
			 *	We declare all events for receive information about quiddities
			 */

			initialize: function() {

				/* Default table controler. Control the properties values with device (midi osc, etc..) */
				this.add({
					name: "controler",
					type: "control",
					description: "it's the default table for controler.",
					menus: {
						sources: {
							type: "midi",
							name: "control midi",
							dataName: "midisrc"
						},
						destinations: {
							type: "quiddsProperties",
							name: "property"
						}
					}
				});


				/* This table manage the transfer between source and destination */
				this.add({
					name: "transfer",
					type: "transfer",
					description: "it's the default table for transfer.",
					menus: {
						sources: {
							type: "quidds",
							name: "source"
						},
						destinations: {
							type: "client",
							name: "destination"
						}
					}
				});
			}
		});

		return CollectionTables;
	})