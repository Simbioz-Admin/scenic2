define([
	'underscore',
	'backbone',
], function(_, Backbone) {

	var Table = Backbone.Model.extend({
		defaults: {
			"date" : null,
			"type" : null,
			"from" : null,
			"message" : null
		},
		initialize: function() {
		}
	});

	return Table;
})