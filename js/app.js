// Filename: app.js
define(

	/** 
	 *	View Source
	 *	The source view is for each source type quiddity create whatsoever to control or transfer table
	 *	@exports Views/Launch
	 */

	[
		'underscore',
		'backbone',
		'jquery',
		'collections/tables', 'collections/classes_doc', 'collections/clients', 'collections/quidds', 'collections/control_properties', 'collections/loggers', 'collections/channels-irc',
		'views/clients', 'views/global', 'views/quidds', 'views/control_properties', 'views/loggers', 'views/ircs'

	],

	function(
		_,
		Backbone,
		$,
		CollectionTables, CollectionClassesDoc, CollectionClients, CollectionQuidds, CollectionsControlProperties, CollectionLoggers, CollectionIrcs,
		ViewClients, ViewGlobal, ViewQuidds, ViewControlProperties, ViewLoggers, ViewIrcs
	) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Jquery
		 *	@requires CollectionTables
		 *	@requires CollectionClassesDoc
		 *	@requires CollectionClients
		 *	@requires CollectionQuidds
		 *	@requires CollectionsControlProperties
		 *	@requires CollectionLoggers
		 *	@requires CollectionIrcs
		 *	@requires ViewClients
		 *	@requires ViewGlobal
		 *	@requires ViewQuidds
		 *	@requires ViewControlProperties
		 *	@requires ViewLoggers
		 *	@requires ViewIrcs
		 *  @augments module:Backbone.View
		 */

		var initialize = function() {
			"use strict";

			//loading the different collections
			collections.classesDoc = new CollectionClassesDoc();
			collections.classesDoc.fetch({
				success: function(response) {
					collections.tables = new CollectionTables();
					collections.clients = new CollectionClients();
					collections.clients.fetch();

					collections.quidds = new CollectionQuidds();
					collections.quidds.fetch();

					collections.controlProperties = new CollectionsControlProperties();
					collections.controlProperties.fetch();

					collections.loggers = new CollectionLoggers();
					views.logger = new ViewLoggers({
						collection: collections.loggers
					});

					//loading views
					views.clients = new ViewClients({
						collection: collections.clients
					});
					views.global = new ViewGlobal();
					views.quidds = new ViewQuidds({
						collection: collections.quidds
					});
					views.controlProperties = new ViewControlProperties({
						collection: collections.controlProperties
					});
				}
			});

			collections.irc = new CollectionIrcs();
			views.ircs = new ViewIrcs();
		}


		return {
			initialize: initialize
		};

	});