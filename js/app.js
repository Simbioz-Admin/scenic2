// Filename: app.js
define([
  'underscore',
  'backbone',
  'jquery',
  'collections/tables', 'collections/classes_doc', 'collections/clients', 'collections/quidds', 'collections/control_properties', 'collections/loggers', 'collections/channels-irc',
  'views/clients', 'views/global', 'views/quidds', 'views/control_properties', 'views/loggers', 'views/ircs'

], function(_,
  Backbone,
  $,
  CollectionTables, CollectionClassesDoc, CollectionClients, CollectionQuidds, CollectionsControlProperties, CollectionLoggers, CollectionIrcs,
  ViewClients, ViewGlobal, ViewQuidds, ViewControlProperties, ViewLoggers, ViewIrcs
) {
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
		views.logger = new ViewLoggers({collection : collections.loggers});

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