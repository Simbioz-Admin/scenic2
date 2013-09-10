define([
	'underscore',
	'backbone',
	'views/controlProperty'
], function(_, Backbone, ViewControlProperty) {

	var ModelControlProperty = Backbone.Model.extend({
		idAttribute: "name",
		defaults: {
			"name": null,
			"property": null,
			"quiddName": null
		},
		initialize: function() {
			console.log("the control property", this.get("name"), "is created");
			var that = this;
			//when the model quidd is created and we are recovered all value necessary, we created automaticlly one or multiple views 
			_.each(collections.tables.toJSON(), function(table) {
				if (table.type == "control") {
					var viewControlProperty = new ViewControlProperty({
						model: that,
						table: "control"
					});
				}
			});

		},
		delete: function() {
			var that = this;
			socket.emit("removeValuePropertyOfDico", "controlProperties", this.get("name"));
			//check if mapper exist for this property and if yes : delete
			collections.quidds.each(function(quidd) {
				if(quidd.get("name").indexOf(that.get("name")) != -1)
					quidd.delete();
			});
		}
	});

	return ModelControlProperty;
})