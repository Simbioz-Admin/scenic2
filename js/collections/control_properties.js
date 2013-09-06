define([
	'underscore',
	'jquery',
	'backbone',
	'models/control_property'
], function(_, $, Backbone, ModelControlProperty) {

	var CollectionControlProperties = Backbone.Collection.extend({
		url: '/quidds/dico/properties/controlProperties/value',
		model: ModelControlProperty,
		parse: function(results, xhr) {
			return results;
		},
		initialize: function() {
			console.log("init CollectionControlProperties");
			var that = this;
			//this.bind("add", this.setDico, this);

			socket.on("setDicoValue", function(property, value) {
				that.add(value);
				views.global.notification("info", "The property " + value.property + " of " + value.quiddName + " is added.");
			});

			socket.on("removeValueOfPropertyDico", function(property, name) {
				that.remove(name);
				views.global.notification("info", "The property control " + name + " is deleted.");
			});
		},
		setDico: function(quiddName, property, callback) {
			var newControlProperty = {
				name: quiddName + "_" + property,
				quiddName: quiddName,
				property: property
			}
			socket.emit("setPropertyValueOfDico", "controlProperties", newControlProperty, function(ok) {
				callback(quiddName + "_" + property);
			});
		}
	});

	return CollectionControlProperties;
});