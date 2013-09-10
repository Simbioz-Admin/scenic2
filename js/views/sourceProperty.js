define([
	'underscore',
	'backbone',
	'text!/templates/sourceProperty.html',
], function(_, Backbone, TemplateSourceProperty) {

	var ViewSource = Backbone.View.extend({
		tagName: 'table',
		className: 'source',
		table: null,
		events: {
			"click .edit-source": "edit",
			"click .remove-source": "removeClick",
			"click .preview": "preview",
			'click .info': 'info'
		},
		initialize: function() {
			this.model.on('remove', this.removeView, this);
			this.model.on('change:properties', this.render, this);

			this.table = this.options.table;
			this.render();

		},
		render: function() {
			$(this.el).html("");
			var that = this,
				properties = this.model.get("properties"),
				destinations = (this.table == "transfer" ? collections.clients.toJSON() : collections.controlProperties.toJSON()),
				countProperty = 0;

			_.each(properties, function(property, index) {
				if (property.name != "device" && property.name != "devices-json" && property.name != "started") {

					var template = _.template(TemplateSourceProperty, {
						property: property,
						index: countProperty,
						nbProperties: properties.length,
						sourceName: that.model.get("name"),
						destinations: destinations
					});

					$(that.el).append($(template));
					countProperty++;
				}
			});

			if ($(that.el).html() == "") {
				var template = _.template(TemplateSourceProperty, {
					sourceName: that.model.get("name"),
					property: null
				});

				$(that.el).append($(template));
			}

			//here we define were go the source  vhttpsdpdec
			if (this.model.get("class") == "httpsdpdec") {
				$("#" + that.table + " #remote-sources").prepend($(that.el));
			} else {
				$("#" + that.table + " #local-sources").prepend($(that.el));
			}

			//check if mapper exist for the 
			collections.quidds.each(function(quidd) {
				if(quidd.get("category") == "mapper" && quidd.get("view") != null) {
					quidd.get("view").render();
				}
			});


		},
		edit: function() {
			console.log(this.model);
			this.model.edit();
		},
		removeClick: function() {
			this.model.delete();
		},
		removeView: function() {
			this.remove();
		},
		preview: function(element) {
			this.model.preview(element);
		},
		info: function(element) {
			this.model.info(element);
		}
	});

	return ViewSource;
})