define(

	/** 
	 *	Model of Table
	 *	Table is for organise in different table the source and destination
	 *	@exports Models/table
	 */

	[
		'underscore',
		'backbone',
		'views/table'
	],

	function(_, Backbone, ViewTable) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires ViewTable
		 *  @augments module:Backbone.Model
		 */

		var TableModel = Backbone.Model.extend(

		/**
		 *	@lends module: Models/table~TableModel.prototype
		 */

		{
			idAttribute: "name",
			defaults: {
				"name": null,
				"type": null,
				"description": null,
				"menus": {
					sources: {
						type: "",
						name: null,
						value: null
					},
					destinations: {
						type: "",
						name: null,
						value: null
					}
				}
			},

			/* Called when the table is initialized and create a view */

			initialize: function() {
				var viewTable = new ViewTable({
					model: this
				});
			}
		});

		return TableModel;
	})