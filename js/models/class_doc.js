define([
	'underscore',
	'backbone'
], function(_, Backbone) {

	var class_doc = Backbone.Model.extend({
		idAttribute: "class name",
		defaults: {
			"class name": null,
			"category": null,
			"short_description": null,
			"properties": null
		},
		initialize: function() {
			//ask for create node osc-receive\
		}
	});

	return class_doc;
})