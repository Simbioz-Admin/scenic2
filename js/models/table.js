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
					"menus": []
				},

				/* Called when the table is initialized and create a view */

				initialize: function() {
					
					/* Create collection source and destination */

					var quiddsSources = this.getQuidds("sources");
					var collectionSources = new Backbone.Collection.extend();
					collectionSources.add(quiddsSources);
					console.log(collectionSources);
					//var collectionDestination = new Backbone.Collection.extend();

					// var viewTable = new ViewTable({
					// 	model: this
					// });
				},

				/* Return the quiddities authorize baded on tyoe (source or destination) */

				getQuidds : function(orientation) {
					console.log("Get quidds "+orientation+ " for the table "+this.get("type"));
					
					/* parse global collection quidds for return just what you want */
					var quiddsSelect = this.get(orientation).select;
					return collections.quidds.SelectQuidds(quiddsSelect);
				},

				/* Called for know if the quiddity can be added to the table */

				addToTable: function(type, value) {

					// var addToTable = false
					// if(this.get("menus")[type].byCategory){
					// 	var	select = this.get("menus")[type].byCategory.select
					// 	,	exclude = this.get("menus")[type].byCategory.excludes;

					// 	if (select && _.contains(select, value)) addToTable = true;
					// 	if (exclude && _.contains(exclude, value)) {
					// 		addToTable = false;
					// 	} else if (!select) {
					// 		addToTable = true;
					// 	}
					// }
					// return addToTable;

				},

			});

		return TableModel;
	})