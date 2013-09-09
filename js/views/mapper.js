define([
	'underscore',
	'backbone',
], function(_, Backbone) {

	var ViewDestination = Backbone.View.extend({
		tagName: 'div',
		className: 'mapper',
		table: null,
		events: {
			"click .edit": "edit",
			"click": "removeClick"
		},
		initialize: function() {
			this.model.on('remove', this.removeView, this);
			this.table = this.options.table;
			var info = this.model.get("name").split("_");
			//find the connection
			var box = $("[data-quiddname='"+info[1]+"'][data-propertyname='"+info[2]+"'] [data-nameandproperty='"+info[3]+"_"+info[4]+"']");
			box.html($(this.el));
		},
		edit: function() {
			this.model.edit();
		},
		removeClick: function() {
			this.model.delete();
		},
		removeView: function() {
			this.remove();
		}
	});

	return ViewDestination;
})