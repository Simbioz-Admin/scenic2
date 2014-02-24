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
	function(_, Backbone, ModelTable) {

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



					/* Create a table for manage Audio device and connexion */
					var audioTable = {
						name: 'audio',
						type: 'audio',
						description: "Manage audio device and connexion audio",
						menus: [{
							name: "source audio",
							type: "sources"
						}, {
							name: "destination audio",
							type: "destinations"
						}],
						sources: {
							select: ["audio source", "httpsdpdec"]
						},
						destinations: {
							select: ["audio sink"]
						}
					}




					/* Create a table for manage transfer shmdatas  */

					var transferTable = {
						name: "transfer",
						type: "transfer",
						description: "manage connexion with destination type host",
						menus: [{
							name: "source",
							type: "sources"
						}, {
							name: "destination",
							type: "destinations",
							id: "create_receiver"
						}],
						sources: {
							select: ["source", "httpsdpdec"],
							exclude: ["midi source"]
						},
						destinations: collections.receivers
					}



					var controlTable = {
						name: "control",
						type: "control",
						description: "Control properties of quiddities with device",
						menus: [{
							name: "control midi",
							type: "sources"
						}, {
							name: "properties",
							type: "destinations",
							id: "get_properties"
						}],
						sources: {
							select: ["midi source"],
						},
						destinations: collections.receivers
					}


					this.add(audioTable);
					this.add(controlTable);
					this.add(transferTable);
					// this.add({
					// 	name : "audio",
					// 	type : "audio",
					// 	description : "for manage audio source connection",
					// 	menus: {
					// 		sources: {
					// 			type: "sources",
					// 			name: "source audio",
					// 			byCategory : {
					// 				name : "source",
					// 				select : ["audio source"],
					// 				//excludes : ["midi source"]
					// 			}
					// 			// byClasses : {
					// 			// 	select : ["audiotestsrc", "videotestsrc"],
					// 			// 	excludes : ["midi source"]
					// 			// }
					// 		},
					// 		destinations: {
					// 			type: "destinations",
					// 			name: "destination audio",
					// 			byCategory : {
					// 				name : "audio",
					// 				select : ["audio sink"],
					// 				//excludes : ["midi source"]
					// 			}
					// 		}
					// 	}
					// });

					/* Default table controler. Control the properties values with device (midi osc, etc..) */
					// this.add({
					// 	name: "controler",
					// 	type: "control",
					// 	description: "it's the default table for controler.",
					// 	menus: {
					// 		sources: {
					// 			type: "midi",
					// 			name: "control midi",
					// 			dataName: "midisrc"
					// 		},
					// 		destinations: {
					// 			type: "quiddsProperties",
					// 			name: "property"
					// 		}
					// 	}
					// });


					/* This table manage the transfer between source and destination */
					// this.add({
					// 	name: "transfer",
					// 	type: "transfer",
					// 	description: "it's the default table for transfer.",
					// 	menus: {
					// 		sources: {
					// 			type: "sources",
					// 			name: "source",
					// 			byCategory : {
					// 				name : "source",
					// 				excludes : ["midi source", "audio sink"]
					// 			}
					// 			// byClasses : {
					// 			// 	select : ["audiotestsrc", "videotestsrc"],
					// 			// 	excludes : ["midi source"]
					// 			// }
					// 		},
					// 		destinations: {
					// 			type: "client",
					// 			name: "destination"
					// 		}
					// 	}
					// });
				}
			});

		return CollectionTables;
	})