define([
	'underscore',
	'backbone',
	'models/logger'
], function(_, Backbone, ModelLogger) {

	var CollectionLoggers = Backbone.Collection.extend({
		model: ModelLogger,
		url: '/log/',
		parse: function(results, xhr) {
			return results;
		},
		initialize: function() {
			console.log("init CollectionTable");

			    this.bind("add", function (note) {
		         	console.log(note);
		        });

			//create default tables 
			//create the first table for manage transfert
		}
	});

	return CollectionLoggers;
})