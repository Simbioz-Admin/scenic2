define([
	'underscore',
	'backbone',
	'text!/templates/destination.html',
], function(_, Backbone, TemplateDestination) {

	var ViewDestination = Backbone.View.extend({
		tagName: 'td',
		className: 'nameInOut',
		table: null,
		events: {
			"click .edit": "edit",
			"click .remove": "removeClick"
		},
		initialize: function() {
			this.model.on('remove', this.removeView, this);
			this.table = this.options.table;

			var that = this,
				template = _.template(TemplateDestination, {
					name: this.model.get("name")
				});

			$(this.el).append(template);
			$("#" + this.table + " .destinations").append($(this.el));

			$("#control .property").each(function(index, source) {
				$(this).append("<td class='box connect-properties' data-nameandproperty='" + that.model.get("name") + "'></td>");
			});

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