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
				},

				/* Called for know if the quiddity can be added to the table */

				addToTable: function(type, value) {

					var addToTable = false
					if(this.get("menus")[type].byCategory){
						var	select = this.get("menus")[type].byCategory.select
						,	exclude = this.get("menus")[type].byCategory.excludes;

						if (select && _.contains(select, value)) addToTable = true;
						if (exclude && _.contains(exclude, value)) {
							addToTable = false;
						} else if (!select) {
							addToTable = true;
						}
					}
					return addToTable;

				},

			});

		return TableModel;
	})